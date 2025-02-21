import { BaseRepository } from "./base.repository";
import { UserModel } from "../models/user.model";
import { IUserDocument } from "../type/user.type";
import { HttpException } from "../middleware/error.middleware";
import mongoose, { FilterQuery } from 'mongoose';
import { IUserRepository } from "../interfaces/IRepositoryInterface/IUserRepository";

interface UpdateProfileData {
    userName?: string;
    phoneNumber?: string;
    address?: string;
    [key: string]: any;  
}

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
    quizProgress:{
        rank:number;
    }
  }>;


export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor(){
        super(UserModel);
    }

    async findByEmail(email: string): Promise <IUserDocument | null >{
        try{
            return await this.model.findOne({email});
        }catch(error){
            throw error;
        }
    }

    async find(searchQuery:SearchQueryType,skip:number,limit:number): Promise<{ users: IUserDocument[]; total: number }> { 
        try {
            const users = await this.model.find(searchQuery)
            .skip(skip)
            .limit(limit)
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

    async findByIdAndUpdate(userId:string, courseIds: mongoose.Types.ObjectId[] | undefined):Promise<void>{
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


    async UpdateProfile(userId: string, updatedData: Partial<UpdateProfileData>): Promise<any> {
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

    async findUsers(searchQuery:SearchQueryType,skip:number,limit:number): Promise<{ users: IUserDocument[]; total: number }> { 
        try {  
            const users = await this.model.find(searchQuery)
            .sort({ 'quizProgress.rank': 1 })
            .skip(skip)
            .limit(limit)

            const total:number = await this.model.countDocuments(searchQuery);
            return { users, total };

        } catch (error) {
            throw error;
        }
    }

    async findUser(): Promise<{ users: IUserDocument[]; }> { 
        try {  
            const users = await this.model.find()
            .sort({ 'quizProgress.rank': 1 })
            return { users };

        } catch (error) {
            throw error;
        }
    }

    async quizWinners(): Promise<{ quizWinners: IUserDocument[] | null; }> { 
        try {  
            const quizWinners =  await this.model.find()
            .sort({ 'quizProgress.rank': 1 })
            .limit(3)
            return { quizWinners: quizWinners.length > 0 ? quizWinners : null };
        } catch (error) {
            throw error;
        }                                   
    }

    async updateRank():Promise<void>{
        try{
            const users = await this.model.find()
            .sort({'quizProgress.score':-1})
            .select('_id userName quizProgress');

            const rankedUsers = users.map((user,index)=>{
                let rank = (index + 1).toString();
            return {
                userId: user._id,
                rank: rank
              };
            })

            const bulkWrite = rankedUsers.map(userRank=>({
                updateOne:{
                    filter:{_id:userRank.userId},
                    update:{
                        $set:{
                            "quizProgress.rank":userRank.rank
                        }
                    }
                }
            }));

            if (bulkWrite.length > 0) {
                await this.model.bulkWrite(bulkWrite);
              }
          
              return

        }catch(error){
            throw error;
        }
    }

    async aggregate(pipeline: any[]): Promise<any> {
        return this.model.aggregate(pipeline).exec();
      }
      
    
}