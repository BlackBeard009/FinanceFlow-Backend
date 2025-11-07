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

  login(user: UserDocument) {
    const payload: UserPayload = {
      sub: user._id as Types.ObjectId,
      email: user.email,
      providers: user.providers,
    };
    return { access_token: this.jwtService.sign(payload) };
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
