import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorDocument } from "../interfaces/tutor.interface";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import mongoose from "mongoose";
import { NotificationRepository } from "../repositories/notification.repository";
import { INotification } from "../interfaces/notification.interface";

export class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async notification(userId:string): Promise<INotification[] | null> {
        try {
            return await this.notificationRepository.find(userId)
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async notificationRead(userId:string,notificationId:string) {
        try {
            const id = new mongoose.Types.ObjectId(userId);
            const notification = await this.notificationRepository.findOne(notificationId);
            notification?.readBy.push(id);
            notification?.save();
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR);
        }
    }
      
}