import { Document } from "mongoose";

export interface Institute{
    _id:string;
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    country:string;
    state: string;
    district: string;
    applicationId: string;
    status: InstituteStatus;
    department: string[];
    documentUrl: string;
    accessToken?: string;
    refreshToken?: string;
    totalStudents: number;
    createdAt :Date;
    updatedAt : Date;
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