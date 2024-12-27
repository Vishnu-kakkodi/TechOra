import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service"; 
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


export class ReviewController {
    private reviewService: ReviewService;

    constructor(reviewService: ReviewService) {
        this.reviewService = reviewService
    }

    public createReview = async (
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
            const { courseId,currentValue,reviewText } = req.body;
            const response = await this.reviewService.createReview(currentValue,reviewText,userId,courseId);
            res.status(201).json({
                message: response,
            });
        } catch (error) {
            next(error)
        }
    }


    public Review = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const courseId = req.query.courseId as string;            
            const {response,total} = await this.reviewService.Review(courseId);
            res.status(201).json({
                message: "Review fetched",
                data: {response,total}
            });
        } catch (error) {
            next(error)
        }
    }
}