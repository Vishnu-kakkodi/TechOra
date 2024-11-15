import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";


export class CartController{
    private courseService: CourseService;

    constructor(courseService: CourseService){
        this.courseService = courseService
    }

    public addToCart = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            console.log("jai",req.cookies.userData)
            const userId: string = req.cookies.userData._id;
            const { courseId } = req.body; 
            console.log("UserId",userId,"courseId:",courseId)
            const response = await this.courseService.addToCart(userId,courseId);
            res.status(201).json({
                message:"Cart item fetched successfully",
                Data: "data"
            });

        }catch(error){
            next(error)
        }
    }

    public getCartItems = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            // console.log("userDataasdfsdf",req.cookies.userData)
            const userData = req.cookies.userData
            console.log(userData._id)
            const items = await this.courseService.getCartItems(userData._id);
            console.log(items,"Items")
            res.status(201).json({
                message:"Cart item fetched successfully",
                Data: items
            });

        }catch(error){
            next(error);
        }
    }
}