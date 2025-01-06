import { Request, Response, NextFunction } from "express";
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
                res.json({status: STATUS_CODES.UNAUTHORIZED,message:MESSAGES.ERROR.USER_ID_REQUIRED});
            }
            const response = await this.notificationService.notification(userId);
            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
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
                res.json({status: STATUS_CODES.UNAUTHORIZED,message:MESSAGES.ERROR.USER_ID_REQUIRED});
            }
            const response = await this.notificationService.notificationRead(userId,notificationId);
            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data: response,
            });

        } catch (error) {
            next(error)
        }
    }
    
}