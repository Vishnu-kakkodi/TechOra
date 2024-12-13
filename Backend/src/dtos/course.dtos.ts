import { Types } from 'mongoose';

export class CreateCourseDto {
    title!: string;
    department!: string;
    tutorId!: Types.ObjectId | string;
    duration!: string;
    description!: string;
    startDate!: string;
    price!: number;
    status!: 'draft' | 'published';
    thumbnail!: string;  
    institutionId!: Types.ObjectId | string
}

export class UpdateCourseDto {
    title!: string;
    department!: string;
    tutorId!: Types.ObjectId | string;
    duration!: string;
    description!: string;
    startDate!: string;
    price!: number;
    status!: 'draft' | 'published';
    courseId!: string;
}