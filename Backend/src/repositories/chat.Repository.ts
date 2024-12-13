import { BaseRepository } from "./base.repository";
import  {TutorModel}  from "../models/tutor.model";
import { InstituteDocument } from "../interfaces/institute.interface";
import { TutorDocument } from "../interfaces/tutor.interface";
import mongoose from "mongoose";
import { ChatDocument } from "../interfaces/chat.interface";

interface UpdateProfileData {
    tutorname?: string;
    education?: string;
    experiance?: string;
    [key: string]: any;  
}


export class ChatRepository extends BaseRepository<TutorDocument> {
    constructor(){
        super(TutorModel);
    }

    async find(receiverId: string, senderId: string): Promise <ChatDocument[] | null>{
        
        try{
            const receiverID = new mongoose.Types.ObjectId(receiverId);
            const senderID = new mongoose.Types.ObjectId(senderId);

            return await this.model.find({
                $or:[
                    {receiverId:receiverID,senderId:senderID},
                    {receiverId:senderID,senderId:receiverID}
                ]
            });
        }catch(error){
            throw error;
        }
    }
}