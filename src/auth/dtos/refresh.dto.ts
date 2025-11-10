import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RefreshDTO {
  @IsString()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
