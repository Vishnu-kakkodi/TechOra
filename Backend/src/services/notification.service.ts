import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorDocument } from "../type/tutor.type";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IUserDocument } from "../type/user.type";
import { UserRepository } from "../repositories/user.repository";
import mongoose from "mongoose";
import { NotificationRepository } from "../repositories/notification.repository";
import { INotification } from "../type/notification.type";
import { INotificationService } from "../interfaces/IServiceInterface/INotificationService";
import { INotificationRepository } from "../interfaces/IRepositoryInterface/INotificationRepository";

class NotificationService implements INotificationService {
    private notificationRepository: INotificationRepository;

    constructor(notificationRepository: INotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async notification(userId:string): Promise<INotification[] | null> {
        try {
            return await this.notificationRepository.find(userId)
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async notificationRead(userId:string,notificationId:string): Promise<void> {
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

export default NotificationService