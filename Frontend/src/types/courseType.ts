// import { Document, Types } from "mongoose";

// export interface CourseDetailResponse {
//   status: string;
//   message: string;
//   Data: Course | undefined;
// }

// export interface Module {
//   _id:string;
//   title: string;
//   description: string;
//   duration: number;
//   video: string;
//   status: 'draft' | 'published';
//   createdAt?: Date;
//   updatedAt?: Date;
//   draftId?: any;
// }

// export interface Course {
//   _id: string;
//   title: string;
//   department: string;
//   instructor: string;
//   duration: string;
//   description: string;
//   startDate?: string;
//   price?: string;
//   status: 'draft' | 'published';
//   thumbnail?: string;
//   institutionId?: Types.ObjectId | string;
//   modules: Module[];
//   totalModules?: number;
//   totalDuration?: number;
// }

// export type CourseDocument = Course & Document;




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

export interface Course {
  _id: string;
  title: string;
  department: string;
  instructor: string;
  duration: string;
  description: string;
  startDate?: string;
  price?: number; // Changed to number for consistency
  status: 'draft' | 'published';
  thumbnail?: string;
  institutionId?: Types.ObjectId | string;
  modules: Module[];
  totalModules?: number;
  totalDuration?: number;
  isListed?: boolean; // Added based on the sample data
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface CourseListResponse {
  data: CourseDocument[];
  total?: number;
  department?: string[];
  totalCourse:number;
  page?: number;
  limit?: number;
  totalPages?:number;
}

export type CourseDocument = Course & Document;