import { Request, Response, NextFunction } from "express";
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ICartService } from "../interfaces/IServiceInterface/ICartService";


export class CartController {
    private cartService: ICartService ;

    constructor(cartService: ICartService) {
        this.cartService = cartService
    }

    public addToCart = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId: string = req.user?._id
            const { courseId } = req.body;
            const response = await this.cartService.addToCart(userId, courseId);
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
            const userId: string = req.user?._id
            const items = await this.cartService.getCartItems(userId);
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
            const userId: string = req.user?._id
            const { courseId } = req.body;
            await this.cartService.removeCart(userId, courseId);
            res.status(201).json({
                message: "Cart item removed successfully",
            });

        } catch (error) {
            next(error)
        }
    }
}