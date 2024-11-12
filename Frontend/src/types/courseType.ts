import { Document, Types } from "mongoose";

export interface CourseDetailResponse {
  status: string;
  message: string;
  Data: Course | undefined;
}

export interface Module {
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
  price?: string;
  status: 'draft' | 'published';
  thumbnail?: string;
  institutionId?: Types.ObjectId | string;
  modules: Module[];
  totalModules?: number;
  totalDuration?: number;
}

export type CourseDocument = Course & Document;