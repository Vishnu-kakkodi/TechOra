import {Request, Response, NextFunction} from 'express'
import { decodedToken, DecodedToken } from '../helperFunction/authHelper'
import { HttpException } from '../middleware/error.middleware'
import STATUS_CODES from '../constants/statusCode'
import MESSAGES from '../constants/message'
import { CourseController } from './course.controller'
import { CourseService } from '../services/course.service'

export class WishlistController {
    private courseService: CourseService;

    constructor(courseService: CourseService){
        this.courseService = courseService
    }

    public addToWishlist = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED);
            }
            const requiredRole = 'user';
            const userId: string | null = decodedToken(token,requiredRole);
            const {courseId} = req.body;
            const response = await this.courseService.addToWishlist(userId,courseId);
            res.status(201).json({
                message: response,
            });
        }catch(error){
            next(error);
        }
    }


    public wishlistPage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string) || '';
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED);
            }
            const requiredRole = 'user';
            const userId: string | null = decodedToken(token,requiredRole);
            const { favourates, total }  = await this.courseService.wishlistPage(userId, page, limit, search);

            res.status(201).json({
                favourates,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }catch(error){
            next(error);
        }
    }

    public removeWishlist = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try{
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED);
            }
            const requiredRole = 'user';
            const userId: string | null = decodedToken(token,requiredRole);
            const courseId = req.params.courseId;
            const response = await this.courseService.removeWishlist(userId,courseId);
            res.status(201).json({
                message:response
            });
        }catch(error){
            next(error);
        }
    }
}