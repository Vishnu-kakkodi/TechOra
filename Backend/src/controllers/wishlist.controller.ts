import {Request, Response, NextFunction} from 'express'
import { IWishlistService } from '../interfaces/IServiceInterface/IWishlistService';

export class WishlistController {
    private wishlistService: IWishlistService;

    constructor(wishlistService: IWishlistService){
        this.wishlistService = wishlistService
    }

    public addToWishlist = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const userId: string | null = req.user?._id;
            const {courseId} = req.body;
            const response = await this.wishlistService.addToWishlist(userId,courseId);
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
            const userId: string | null = req.user?._id;
            const { favourates, total }  = await this.wishlistService.wishlistPage(userId, page, limit, search);
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
            const userId: string | null = req.user?._id;
            const courseId = req.params.courseId;
            const response = await this.wishlistService.removeWishlist(userId,courseId);
            res.status(201).json({
                message:response
            });
        }catch(error){
            next(error);
        }
    }
}