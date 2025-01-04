import { Request, Response, NextFunction } from "express";
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { INotificationService } from "../interfaces/IServiceInterface/INotificationService";


export class NotificationController {
    private notificationService: INotificationService;

    constructor(notificationService: INotificationService) {
        this.notificationService = notificationService
    }

    public notification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId: string | null = req.user?._id;
            if(!userId){
                res.json({message:"Authentication failed"});
            }
            const response = await this.notificationService.notification(userId);
            res.status(201).json({
                data: response,
            });

        } catch (error) {
            next(error)
        }
    }

    public notificationRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId: string | null = req.user?._id;
            const notificationId = req.params.notificationId;
            if(!userId){
                res.json({message:"Authentication failed"});
            }
            const response = await this.notificationService.notificationRead(userId,notificationId);
            res.status(201).json({
                data: response,
            });

        } catch (error) {
            next(error)
        }
    }
    
}