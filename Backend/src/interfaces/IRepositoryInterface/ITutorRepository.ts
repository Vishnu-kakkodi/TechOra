import { InstituteDocument } from "../../type/institute.type";
import { TutorDocument } from "../../type/tutor.type";
import { IBaseRepository } from "./IBaseRepository";

interface UpdateProfileData {
    tutorname?: string;
    education?: string;
    experiance?: string;
    [key: string]: any;  
}

export interface ITutorRepository extends IBaseRepository<TutorDocument>{
    findById(tutorId: string): Promise <TutorDocument | null>
    findByEmail(instituteEmail: string): Promise <InstituteDocument | null >
    findOne(tutorEmail: string): Promise <TutorDocument | null >
    find(): Promise<InstituteDocument[]>
    findTutors(institutionId: string|null): Promise<TutorDocument[]>
    countTutorsByDepartment(
        filterKey: string, 
        filterValue: string, 
        searchQuery: any,
        skip: number,
        limit: number,
        sortOptions: any
      ): Promise<{ departments: Array<{ department: string}>, total: number }>
    UpdateProfile(tutorId: string, updatedData: Partial<UpdateProfileData>):Promise<any>
}