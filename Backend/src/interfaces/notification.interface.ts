import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";
import { BaseRepository } from "../repositories/base.repository";


interface Notification extends BaseInterface {
    type: string;
    title: string;
    department: string;
    readBy: Types.ObjectId[];
    createdAt: Date;
    createdBy: Types.ObjectId;
  }

export type INotification = Notification & Document;