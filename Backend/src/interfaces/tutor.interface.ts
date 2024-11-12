import { Document, Types  } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface Tutor extends BaseInterface{
    id:string;
    department:string;
    tutorname:string;
    education:string;
    experiance:string;
    gender:string;
    institute: Types.ObjectId;
}

export type TutorDocument = Tutor & Document;