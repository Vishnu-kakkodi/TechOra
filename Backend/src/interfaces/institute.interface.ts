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
    applicationId: string;
    status: InstituteStatus;
    documentUrl: string;
    accessToken?: string;
    refreshToken?: string;
    totalStudents: number;
}

export enum InstituteStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Reject = 'Rejected',
  Pending = 'Pending',
  Verify = 'Verify'
}

export interface InstituteResponse {
    id: string;
    collegeName: string;
    instituteEmail: string;
    applicationId: string;
    status: InstituteStatus;
    totalStudents: number;
  }
  

export type InstituteDocument = Institute & Document;