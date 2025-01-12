import mongoose, { FilterQuery } from "mongoose";
import { IUserDocument } from "../../type/user.type";
import { IBaseRepository } from "./IBaseRepository";

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
    quizProgress:{
        rank:number;
    }
  }>;
  interface UpdateProfileData {
    userName?: string;
    phoneNumber?: string;
    address?: string;
    [key: string]: any;  
}

export interface IUserRepository extends IBaseRepository<IUserDocument>{
    findByEmail(email: string): Promise <IUserDocument | null >
    find(searchQuery:SearchQueryType,skip:number,limit:number): Promise<{ users: IUserDocument[]; total: number }>
    findById(userId : string): Promise<IUserDocument | null>
    findByIdAndUpdate(userId:string, courseIds: mongoose.Types.ObjectId[] | undefined):Promise<void>
    UpdateProfile(userId: string, updatedData: Partial<UpdateProfileData>): Promise<any> 
    findUsers(searchQuery:SearchQueryType,skip:number,limit:number): Promise<{ users: IUserDocument[]; total: number }>
    quizWinners(): Promise<{ quizWinners: IUserDocument[] | null; }>
    updateRank():Promise<void>
    aggregate(pipeline: any[]): Promise<any>
}