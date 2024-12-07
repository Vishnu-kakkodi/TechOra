import { BaseRepository } from "./base.repository";
import { UserModel } from "../models/user.model";
import { IUserDocument } from "../interfaces/user.interface";
import { customError } from "../customError";
import { HttpException } from "../middleware/error.middleware";
import mongoose from 'mongoose';
import { MyCourses } from "../types/user.types";
import { SearchQueryType } from "../services/admin.service";

interface UpdateProfileData {
    userName?: string;
    phoneNumber?: string;
    address?: string;
    [key: string]: any;  
}


export class UserRepository extends BaseRepository<IUserDocument> {
    constructor(){
        super(UserModel);
    }

    async findByEmail(email: string): Promise <IUserDocument | null >{
        try{
            return await this.model.findOne({email});
        }catch(error){
            throw new HttpException(400, "Email does not exist");
        }
    }

    async find(searchQuery:SearchQueryType,skip:number,limit:number): Promise<{ users: IUserDocument[]; total: number }> { 
        try {
            console.log("empty",searchQuery);
            
            const users = await this.model.find(searchQuery)
            .skip(skip)
            .limit(limit)
            // .select('- password');

            const total:number = await this.model.countDocuments(searchQuery);
            console.log(users);
            return { users, total };

        } catch (error) {
            throw error;
        }
    }

    async findById(userId : string): Promise<IUserDocument | null> { 
        try {
            const id = new mongoose.Types.ObjectId(userId)   
            const user =  await this.model.findById({_id:id});
            return user;      
        } catch (error) {
            throw error;
        }
    }

    async findByIdAndUpdate(userId:string, courseIds: mongoose.Types.ObjectId[] | undefined){
        try{
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const updatedUser = await this.model.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        purchasedCourses: {
                            $each: courseIds
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).populate('purchasedCourses');
        }catch(error){
            throw error;
        }
    }


    async UpdateProfile(userId: string, updatedData: Partial<UpdateProfileData>) {
        try {
            const id = new mongoose.Types.ObjectId(userId);
            
            const updateFields = Object.fromEntries(
                Object.entries(updatedData).filter(([_, value]) => value !== undefined)
            );
    
            if (Object.keys(updateFields).length === 0) {
                throw new Error('No valid fields to update');
            }
    
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { 
                    new: true,  
                    runValidators: true  
                }
            );
    
            if (!updatedUser) {
                throw new Error('User not found');
            }
    
            return updatedUser;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new Error('Invalid data provided for update');
            }
            throw error;
        }
    }
    
}