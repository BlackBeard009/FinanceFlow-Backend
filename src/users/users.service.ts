import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(userData: Partial<User>) {
    const user = new this.userModel(userData);
    return user.save();
  }

  async addProvider(user: UserDocument, provider: string, oauthId?: string) {
    if (!user.providers.includes(provider)) user.providers.push(provider);
    if (oauthId) user.oauthIds[provider] = oauthId;
    return user.save();
  }

  async findById(id: Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async updateRefreshToken(
    userId: Types.ObjectId,
    refreshToken: string | null,
  ) {
    return this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }
}
