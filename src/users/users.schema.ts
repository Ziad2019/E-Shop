import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as bcrypt from 'bcrypt';

// interface UserDocument extends User, Document {
//   isModified(path: string): boolean;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User{
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    min: [3, 'password must be at least 3 characters'],
    max: [20, 'password must be at most 20 characters'],
  })
  password: string;
  @Prop({
    type: String,
    enum: ['user', 'admin'],
    default:'user'
  })
  role: string;
  @Prop({
    type: String,
  })
  avatar: string;
  @Prop({
    type: Number,
  })
  age: number;
  @Prop({
    type: String,
  })
  phoneNumber: string;
  @Prop({
    type: String,
  })
  address: string;
  @Prop({
    type: Boolean,
    enum: [false, true],
  })
  active: boolean;
  @Prop({
    type: String,
  })
  verificationCode: string;
  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;

    passwordChangedAt: Date;
    passwordResetCode: String;
    passwordResetExpires: Date;
    passwordResetVerified: Boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;


  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});