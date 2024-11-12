import { Schema, model } from 'mongoose';
import { IUserDocument, UserStatus } from '../interfaces/user.interface';

const userSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active }
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
