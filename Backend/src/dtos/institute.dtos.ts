import { Types } from 'mongoose';


export class CreateUserDto{
    collegeName!: string;
    instituteEmail!: string;
    collegeCode!: string;
    country!: string;
    state!: string;
    district!: string;
    documentUrl?: string;
}

export class CreateTutorDto{
    department!: string;
    tutorname!: string;
    education!: string;
    experiance!: string;
    gender!: string;
    institutionId!: Types.ObjectId | string

}