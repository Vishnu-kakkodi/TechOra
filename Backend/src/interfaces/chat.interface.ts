import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface Chat extends BaseInterface{
    id: string;
    senderId: Types.ObjectId;
    senderRole: string
    receiverId: Types.ObjectId;
    receiverRole:string;
    text: string;
}

export type ChatDocument = Chat & Document