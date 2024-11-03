import { Schema, model, Document } from 'mongoose';
import { IUserDocument } from '../interfaces/user.interface';

const userSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
