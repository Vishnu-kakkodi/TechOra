import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";

export enum UserStatus {
    Active = 'active',
    Inactive = 'inactive',
}

export interface IUser extends BaseInterface{
    id:string;
    userName: string;
    email: string;
    password: string;
    phoneNumber:string;
    status: UserStatus;
    accessToken: string;
    refreshToken: string;
    purchasedCourses: Types.ObjectId[];
    profilePhoto: string;
    quizProgress:{
        score:number;
        progress:string;
        rank:string;
    };
}

export type IUserDocument = IUser & Document;   