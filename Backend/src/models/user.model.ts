import { Schema, model } from 'mongoose';
import { IUserDocument, UserStatus } from '../interfaces/user.interface';

const userSchema = new Schema<IUserDocument>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
    purchasedCourses: [{ 
      type: Schema.Types.ObjectId,
      ref: 'Course',  
      default: [] 
    }],
    profilePhoto: { type: String, required: false },
    quizProgress:{
      score:{type:Number,required: false, default:0},
      progress:{type:String,required: false, default:""},
      rank:{type:String,required: false, default: ""}
    }
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
