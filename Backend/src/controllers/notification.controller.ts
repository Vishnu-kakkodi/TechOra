import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { NotificationService } from "../services/notification.service";


export class NotificationController {
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService
    }

    public notification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const Token = req.cookies.user
            const token = Token.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
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
            const Token = req.cookies.user
            const token = Token.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
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