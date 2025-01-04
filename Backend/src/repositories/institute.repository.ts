import { BaseRepository } from "./base.repository";
import { InstituteModel } from "../models/institute.model";
import { InstituteDocument } from "../type/institute.type";
import mongoose, { FilterQuery } from "mongoose";

export type SearchQueryTypeInstitute = FilterQuery<{
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    applicationId: string;
  }>;



export class InstituteRepository extends BaseRepository<InstituteDocument> {
    constructor(){
        super(InstituteModel);
    }

    async findByEmail(instituteEmail: string): Promise <InstituteDocument | null >{
        try{
            return await this.model.findOne({instituteEmail,status: { $eq: 'Active' } });
        }catch(error){
            throw error;
        }
    }

    async findOne(applicationId: string): Promise <InstituteDocument | null >{
        try{
            return await this.model.findOne({ applicationId: applicationId,status: { $ne: 'Active' }  });
        }catch(error){
            throw error;
        }
    }

    async find(searchQuery:SearchQueryTypeInstitute,skip:number,limit:number): Promise<{ institutes: InstituteDocument[]; total: number }> { 
        try {
            const institutes = await this.model.find(searchQuery)
            .skip(skip)
            .limit(limit)

            const total:number = await this.model.countDocuments(searchQuery);
            return { institutes, total };

        } catch (error) {
            throw error;
        }
    }

    
    async findById(institutionId : string ): Promise<InstituteDocument | null> { 
        try {
            const id = new mongoose.Types.ObjectId(institutionId)
            const institute =  await this.model.findById(id);
            return institute;            
        } catch (error) {
            throw error;
        }
    }

    async CountDepartment(
        filterKey: string, 
        filterValue: string, 
        searchQuery: any,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
    ): Promise<{ departments: Array<{ department: string}>}> { 
        try {
            const id = new mongoose.Types.ObjectId(filterValue);
                      
                      const filter: Record<string, any> = {
                        [filterKey]: id,
                        ...searchQuery,
                      };
                      
                      const departmentCounts = await this.model.aggregate([
                        { 
                          $match: filter 
                        },
                        {
                          $project: {
                            _id: 0,
                            department: 1,
                          }
                        },
                        { $sort: sortOptions },
                        { $skip: skip },
                        { $limit: limit }
                      ]);
                  
                      return { 
                        departments: departmentCounts, 
                      };            
        } catch (error) {
            throw error;
        }
    }
}