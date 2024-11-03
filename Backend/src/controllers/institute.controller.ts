import { Request, Response, NextFunction } from "express";
import { InstituteService } from "../services/institute.service";
import { CreateUserDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { generateToken } from "../utils/generateToken";

export class InstitutionController{
    constructor(private readonly instituteService: InstituteService){}

    async verifyEmail(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try {
            console.log(req.body, "controller");
            const response = await this.instituteService.verifyEmail(req.body.email);
            
            if (response) {
                res.cookie('institutionOTP', response, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 2 * 60 * 1000,
                });
                res.status(201).json({ message: 'Successful' });
            } else {
                res.status(400).json({ message: 'Verification failed' });
            }
        } catch (error) {
            next(error);
        }
    }

    async verifyOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const { otp } = req.body;
            console.log(otp,"controller")
            console.log("Hai")
            const CookieOtp: string = req.cookies.institutionOTP;
            console.log(CookieOtp);
            const response = await this.instituteService.verifyOtp(otp,CookieOtp);
            if(response){
                res.clearCookie('userData');
                res.status(201).json({message:'Successfull'});
            }
        }catch(error){
            next(error);
        }
    }

    async createUser(
        req: Request<{}, {}, CreateUserDto>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            console.log(req.body,"controller")
            console.log("Hai")
            const user = await this.instituteService.createUser(req.body);
            console.log(user)
            res.status(201).json({user, message:'Successfull'});
        }catch(error){
            next(error);
        }
    }

    async getInstitution(
        req: Request<{ email: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail);
            if (!institute) {
                throw new HttpException(404, 'Institution not found');
            }
            res.json({ institute,message:"Login successfully" });
        } catch (error) {
            next(error);
        }
    }

 
}