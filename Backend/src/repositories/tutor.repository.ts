import { BaseRepository } from "./base.repository";
import  {TutorModel}  from "../models/tutor.model";
import { InstituteDocument } from "../type/institute.type";
import { TutorDocument } from "../type/tutor.type";
import mongoose from "mongoose";
import { ITutorRepository } from "../interfaces/IRepositoryInterface/ITutorRepository";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";

interface UpdateProfileData {
    tutorname?: string;
    education?: string;
    experiance?: string;
    [key: string]: any;  
}


export class TutorRepository extends BaseRepository<TutorDocument> implements ITutorRepository {
    constructor(){
        super(TutorModel);
    }

    async findById(tutorId: string): Promise <TutorDocument | null>{
        
        try{
            const id = new mongoose.Types.ObjectId(tutorId);
            return await this.model.findById(id);
        }catch(error){
            throw error;
        }
    }

    async findByEmail(instituteEmail: string): Promise <InstituteDocument | null >{
        try{
            return await this.model.findOne({instituteEmail});
        }catch(error){
            throw error;
        }
    }

    async findOne(tutorEmail: string): Promise <TutorDocument | null >{
        try{
            return await this.model.findOne({tutorEmail})
            .populate({
                path:'institutionId',
                select:'collegeName'
            });
        }catch(error){
            throw error;
        }
    }

    async find(): Promise<InstituteDocument[]> { 
        try {
            return await this.model.find();
        } catch (error) {
            throw error;
        }
    }

    async findTutors(institutionId: string|null): Promise<TutorDocument[]> { 
        try {
            return await this.model.find({institutionId:institutionId});
        } catch (error) {
            throw error;
        }
    }

    async countTutorsByDepartment(
        filterKey: string, 
        filterValue: string, 
        searchQuery: any,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
      ): Promise<{ departments: Array<{ department: string}>, total: number }> {
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
              $group: {
                _id: "$department",
                tutorCount: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                department: "$_id",
                tutorCount: 1
              }
            },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limit }
          ]);
      
          const total = await this.model.aggregate([
            { 
              $match: filter 
            },
            {
              $group: {
                _id: "$department",
                tutorCount: { $sum: 1 }
              }
            },
            { $count: "totalDepartments" }
          ]);

          console.log(departmentCounts,total)
      
          return { 
            departments: departmentCounts, 
            total: total[0]?.totalDepartments || 0 
          };
        } catch (error) {
          throw error;
        }
      }


      async UpdateProfile(tutorId: string, updatedData: Partial<UpdateProfileData>):Promise<any> {
        try {
            const id = new mongoose.Types.ObjectId(tutorId);
            
            const updateFields = Object.fromEntries(
                Object.entries(updatedData).filter(([_, value]) => value !== undefined)
            );
    
            if (Object.keys(updateFields).length === 0) {
                throw new Error('No valid fields to update');
            }
    
            const updatedTutor = await this.model.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { 
                    new: true,  
                    runValidators: true  
                }
            ).populate({
                path:'institutionId',
                select:'collegeName'
            });
    
            if (!updatedTutor) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.DATA_NOTFOUND);
            }
    
            return updatedTutor;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new Error('Invalid data provided for update');
            }
            throw error;
        }
    }
}