import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.type";

export interface CourseDetailResponse {
    message: string;
    Data: Course | null;
    purchased: string[] | undefined;
  }

  export interface CourseDetailResponseInstitute {
    message: string;
    Data: Course | null;
  }

export interface Module {
    id:Types.ObjectId;
    title: string;
    description: string;
    duration: number;
    video: string;
    status: 'list' | 'unlist';
    createdAt?: Date;
    updatedAt?: Date;
    draftId?: any;
}

export interface Course extends BaseInterface {
    id: string;
    title: string;
    department: string;
    tutorId: Types.ObjectId | string;
    duration: string;
    description: string;
    startDate: string;
    price: number;
    status: 'draft' | 'published';
    thumbnail?: string;
    enrolledStudents: number;
    institutionId: Types.ObjectId | string;
    reviewId: Types.ObjectId | string;
    modules: Module[];
    totalModules: number;
    totalDuration: number;
    isListed:boolean;
    averageRating: number;
    totalReviews: number;
}

export type CourseDocument = Course & Document;