import { Types } from 'mongoose';

export class RefreshDTO {
  userId: Types.ObjectId;
  refreshToken: string;
}
