import { FilterQuery } from "mongoose";
import { InstituteDocument } from "../../type/institute.type";
import { IBaseRepository } from "./IBaseRepository";


export type SearchQueryTypeInstitute = FilterQuery<{
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    applicationId: string;
  }>;



export interface IInstituteRepository extends IBaseRepository<InstituteDocument>{
    findByEmail(instituteEmail: string): Promise <InstituteDocument | null >
    findOne(applicationId: string): Promise <InstituteDocument | null >
    find(searchQuery:SearchQueryTypeInstitute,skip:number,limit:number): Promise<{ institutes: InstituteDocument[]; total: number }>
    findById(institutionId : string ): Promise<InstituteDocument | null>
    CountDepartment(
        filterKey: string, 
        filterValue: string, 
        searchQuery: any,
        skip: number,
        limit: number,
        sortOptions: any 
    ): Promise<{ departments: Array<{ department: string}>}>
}