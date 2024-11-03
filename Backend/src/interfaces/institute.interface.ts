import { Document } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface Institute extends BaseInterface{
    id:string;
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    country:string;
    state: string;
    district: string;
}

export type InstituteDocument = Institute & Document;