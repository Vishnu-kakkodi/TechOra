import { INotification } from "../../type/notification.type";



export interface INotificationService{
    notification(userId:string): Promise<INotification[] | null>
    notificationRead(userId:string,notificationId:string): Promise<void>
}