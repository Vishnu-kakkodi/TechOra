import { BaseRepository } from "./base.repository";
import  {TutorModel}  from "../models/tutor.model";
import { InstituteDocument } from "../interfaces/institute.interface";
import { TutorDocument } from "../interfaces/tutor.interface";
import mongoose from "mongoose";

interface UpdateProfileData {
    tutorname?: string;
    education?: string;
    experiance?: string;
    [key: string]: any;  
}


export class TutorRepository extends BaseRepository<TutorDocument> {
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

    
    // async findById(instituteId : string): Promise<InstituteDocument | null> { 
    //     try {
    //         console.log("instituteId",typeof(instituteId));
            
    //         const institute =  await this.model.findById(instituteId);
    //         console.log(institute,"ufdsakdgks");
    //         return institute;
            
    //     } catch (error) {
    //         throw error;
    //     }
    // }


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
          console.error('Error counting tutors by department:', error);
          throw error;
        }
      }


      async UpdateProfile(tutorId: string, updatedData: Partial<UpdateProfileData>) {
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
                throw new Error('Tutor not found');
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