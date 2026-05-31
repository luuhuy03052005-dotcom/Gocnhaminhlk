import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserStatus = 'ACTIVE' | 'BLOCKED';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  firebaseUid: string;

  @Prop({ required: true, unique: true, trim: true })
  phoneNumber: string;

  @Prop({ trim: true })
  fullName?: string;

  @Prop({ trim: true })
  avatarUrl?: string;

  @Prop({ required: true, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE', index: true })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
