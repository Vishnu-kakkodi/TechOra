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
}

export enum InstituteStatus {
  Active = 'active',
  Inactive = 'inactive',
  Reject = 'reject',
  Pending = 'pending',
  Verify = 'verify'
}

export interface InstituteResponse {
    id: string;
    collegeName: string;
    instituteEmail: string;
    applicationId: string;
    status: InstituteStatus;
  }
  

export type InstituteDocument = Institute & Document;