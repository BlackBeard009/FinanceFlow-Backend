import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/database/schemas/user.schema';
import { UserPayload } from 'src/users/types/user.types';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const doesExist = await this.usersService.findByEmail(email);
    if (doesExist) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      email,
      password: hashed,
      name: name,
      providers: ['local'],
    });

    return this.login(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload: UserPayload = {
      sub: user._id as Types.ObjectId,
      email: user.email,
      providers: user.providers,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(payload.sub, hashedRT);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async logout(user: UserDocument) {
    await this.usersService.updateRefreshToken(
      user._id as Types.ObjectId,
      null,
    );
  }

  async refreshToken(userId: Types.ObjectId, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new Error('Access Denied');

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new Error('Invalid Refresh Token');

    return this.login(user);
  }

  async validateOAuthUser(
    provider: string,
    profile: any,
  ): Promise<UserDocument> {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      user = await this.usersService.createUser({
        name: profile.name,
        email: profile.email,
        providers: [provider],
        oauthIds: { [provider]: profile.id },
      });
    } else {
      await this.usersService.addProvider(user, provider, profile.id);
    }

    return user;
  }
}
