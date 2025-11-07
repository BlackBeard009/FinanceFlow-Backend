import { Types } from 'mongoose';

export interface UserPayload {
  sub: Types.ObjectId;
  email: string;
  providers: string[];
}
