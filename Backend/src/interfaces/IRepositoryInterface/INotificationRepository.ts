import { INotification } from "../../type/notification.type";
import { IBaseRepository } from "./IBaseRepository";


export interface INotificationRepository extends IBaseRepository<INotification>{
    find(userId:string): Promise<INotification[] | null>
    findOne(notificationId:string): Promise<INotification | null>
    recentActivity(tutorId:string): Promise<INotification[] | null>
}