import { Document, Types } from "mongoose";

export interface CourseDetailResponse {
  status: string;
  message: string;
  Data?: Course; 
  purchased: string[]
}

export interface Module {
  _id: string;
  title: string;
  description: string;
  duration: number;
  video: string;
  status: 'draft' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
  draftId?: any;
}

export interface Tutor{
  _id:string;
  department:string;
  tutorname:string;
  tutorEmail:string;
  password:string;
  education:string;
  experiance:string;
  gender:string;
  profilePic: string;
}

export interface Course {
  _id: string;
  title: string;
  department: string;
  tutorId?: Tutor;
  duration: string;
  description: string;
  startDate?: string;
  price?: number; 
  status: 'draft' | 'published';
  thumbnail?: string;
  institutionId?: Types.ObjectId | string;
  modules: Module[];
  totalModules?: number;
  totalDuration?: number;
  isListed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface CourseListResponse {
  course: CourseDocument[];
  total?: number;
  department?: string[];
  totalCourse:number;
  page?: number;
  limit?: number;
  totalPages?:number;
}

export type CourseDocument = Course & Document;