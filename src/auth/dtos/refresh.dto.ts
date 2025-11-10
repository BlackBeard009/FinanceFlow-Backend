import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RefreshDTO {
  @IsString()
  userId: Types.ObjectId;

  @IsString()
  refreshToken: string;
}
