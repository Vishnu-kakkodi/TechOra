import { Document } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface IUser extends BaseInterface{
    id:string;
    userName: string;
    email: string;
    password: string;
    phoneNumber:string;
}

export type IUserDocument = IUser & Document;