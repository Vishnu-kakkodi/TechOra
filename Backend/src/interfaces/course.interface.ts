import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface CourseDetailResponse {
    message: string;
    Data: Course | null;
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

export interface Course extends BaseInterface {
    id: string;
    title: string;
    department: string;
    instructor: string;
    duration: string;
    description: string;
    startDate: string;
    price: string;
    status: 'draft' | 'published';
    thumbnail?: string;
    institutionId: Types.ObjectId | string;
    modules: Module[];
    totalModules: number;
    totalDuration: number;
}

export type CourseDocument = Course & Document;