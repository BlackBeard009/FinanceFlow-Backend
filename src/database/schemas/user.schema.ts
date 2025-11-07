import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: [] })
  providers: string[];

  @Prop({
    type: Map,
    of: String,
    default: {},
  })
  oauthIds: Record<string, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
