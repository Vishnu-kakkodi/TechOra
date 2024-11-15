import { Document } from "mongoose";
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
}

export type IUserDocument = IUser & Document;   