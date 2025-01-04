import { CreateUserDto } from "../../dtos/institute.dtos";
import { Institute, InstituteDocument } from "../../type/institute.type";
import { TutorDocument } from "../../type/tutor.type";



export interface IInstituteService{


    trackStatus(trackID: string): Promise<InstituteDocument | null>
    verifyEmail(email: string): Promise<string[]>
    verifyOtp(otp: string, CookieData: string): Promise<string | undefined>
    createInstitute(instituteData: CreateUserDto): Promise<Institute>
    getUgetInstitution(instituteEmail: string, collegeCode: string): Promise<InstituteDocument | null>
    createTutor(tutorData: any): Promise<void>
    tutorList(institutionId: string | null): Promise<TutorDocument[] | undefined>
    addDepartment(institutionId: string | null, department: string):Promise<void>
    getDepartment(institutionId: string, page: number, limit: number, search: string): Promise<{ departments: any; total: number; }>

}