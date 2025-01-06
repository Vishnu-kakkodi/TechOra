import { Request, Response, NextFunction } from "express";
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IReviewService } from "../interfaces/IServiceInterface/IReviewService";


export class ReviewController {
    private reviewService: IReviewService;

    constructor(reviewService: IReviewService) {
        this.reviewService = reviewService
    }

    public createReview = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {            
            const userId: string | null = req.user?._id;
            const { courseId,currentValue,reviewText } = req.body;
            const response = await this.reviewService.createReview(currentValue,reviewText,userId,courseId);
            res.json({
                status:STATUS_CODES.SUCCESS,
                message:MESSAGES.SUCCESS.DATA_RETRIEVED,
                data: response
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
            res.json({
                status:STATUS_CODES.SUCCESS,
                message:MESSAGES.SUCCESS.DATA_RETRIEVED,
                data: {response,total}
            });
        } catch (error) {
            next(error)
        }
    }
}