import { Document, Types  } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface Tutor extends BaseInterface{
    id:string;
    department:string;
    tutorname:string;
    tutorEmail:string;
    password:string;
    isAdmin:boolean;
    education:string;
    experiance:string;
    gender:string;
    institutionId: Types.ObjectId;
    profilePic: string;
    accessToken?: string;
    refreshToken?: string;
}

export type TutorDocument = Tutor & Document;