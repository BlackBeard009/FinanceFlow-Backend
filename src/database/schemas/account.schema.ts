import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({
    enum: ['cash', 'bank', 'credit', 'investment', 'other'],
    default: 'cash',
  })
  type: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ default: 'BDT' })
  currency: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop()
  description?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
AccountSchema.index({ user: 1, name: 1 }, { unique: true });
