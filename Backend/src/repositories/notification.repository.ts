import { BaseRepository } from "./base.repository";
import { CartDocument } from "../type/cart.type";
import mongoose from 'mongoose';
import {INotification}  from "../type/notification.type";
import notificationModel from "../models/notification.model";



export class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(notificationModel);
    }


    async find(userId:string): Promise<INotification[] | null> {
        try {
            return await this.model.find({readBy: { $nin: [userId] }})
        } catch (error) {
            throw error
        }
    }

    async findOne(notificationId:string): Promise<INotification | null> {
        try {
            const id = new mongoose.Types.ObjectId(notificationId);
            return await this.model.findById(id);
        } catch (error) {
            throw error
        }
    }

    async recentActivity(tutorId:string): Promise<INotification[] | null> {
        try {
            const id = new mongoose.Types.ObjectId(tutorId);
            return await this.model.find({createdBy:id}).sort({createdAt:-1}).limit(2)
            .select('type title createdAt');
        } catch (error) {
            throw error
        }
    }
}