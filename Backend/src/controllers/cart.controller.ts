import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


export class CartController {
    private courseService: CourseService;

    constructor(courseService: CourseService) {
        this.courseService = courseService
    }

    public addToCart = async (
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
            const { courseId } = req.body;
            const response = await this.courseService.addToCart(userId, courseId);
            res.status(201).json({
                message: response,
            });

        } catch (error) {
            next(error)
        }
    }

    public getCartItems = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const Token = req.cookies.user
            const token = Token.accessToken;
            const requiredRole = "user";
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const userId: string | null = decodedToken(token, requiredRole);
            const items = await this.courseService.getCartItems(userId);
            if (!items) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            res.status(201).json({
                message: "Cart item fetched successfully",
                Data: items
            });

        } catch (error) {
            next(error)
        }
    }

    public removeCart = async (
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
            const { courseId } = req.body;
            await this.courseService.removeCart(userId, courseId);
            res.status(201).json({
                message: "Cart item removed successfully",
            });

        } catch (error) {
            next(error)
        }
    }
}