import { Types } from 'mongoose';

export class CreateCourseDto {
    title!: string;
    department!: string;
    instructor!: string;
    duration!: string;
    description!: string;
    startDate!: string;
    price!: string;
    status!: 'draft' | 'published';
    thumbnail!: string;  
    institutionId!: Types.ObjectId | string
}