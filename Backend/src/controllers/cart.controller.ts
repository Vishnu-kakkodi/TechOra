import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { decodedToken } from "../helperFunction/authHelper";


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
            console.log(Token)
            const token = Token.accessToken;
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
            const { courseId } = req.body;
            console.log("UserId", userId, "courseId:", courseId)
            const response = await this.courseService.addToCart(userId, courseId);
            res.status(201).json({
                message: "Cart item fetched successfully",
                Data: "data"
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
            console.log(Token)

            const token = Token.accessToken;
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
            const items = await this.courseService.getCartItems(userId);
            console.log(items, "Items")
            res.status(201).json({
                message: "Cart item fetched successfully",
                Data: items
            });

        } catch (error) {
            next(error);
        }
    }

    public removeCart = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            console.log("Remove request initiated");
            
            const Token = req.cookies.user
            const token = Token.accessToken;
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
            const { courseId } = req.body;
            console.log("UserId", userId, "courseId:", courseId)
            const response = await this.courseService.removeCart(userId, courseId);
            res.status(201).json({
                message: "Cart item removed successfully",
            });

        } catch (error) {
            next(error)
        }
    }
}