import { BaseRepository } from "./base.repository";
import { InstituteModel } from "../models/institute.model";
import { InstituteDocument } from "../interfaces/institute.interface";
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
            console.log(typeof(applicationId))
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
            console.log(institutes);
            return { institutes, total };

        } catch (error) {
            throw error;
        }
    }

    
    async findById(instituteId : string): Promise<InstituteDocument | null> { 
        try {
            console.log("instituteId",instituteId);
            console.log("instituteId",typeof(instituteId));
            const id = new mongoose.Types.ObjectId(instituteId)
            console.log("instituteId",id);
            const institute =  await this.model.findById(id);
            console.log(institute,"ufdsakdgks");
            return institute;
            
        } catch (error) {
            throw error;
        }
    }
}