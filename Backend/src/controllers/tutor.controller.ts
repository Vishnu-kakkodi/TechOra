import { Request, Response, NextFunction } from "express";
import { InstituteService } from "../services/institute.service";
import { CreateUserDto, CreateTutorDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { TutorService } from "../services/tutor.service";

export class TutorController{
    constructor(private readonly tutorService: TutorService){}

    async tutorLogin(
        req: Request<{ tutorEmail: string, password: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const tutor = await this.tutorService.tutorLogin(req.body.tutorEmail,req.body.password);
            if (!tutor) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const { accessToken, refreshToken, ...tutorDetails } = tutor;
            const Token ={
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            setCookie(res,'tutor',Token);

            res.json({ tutor,message:"Login successfully" });
        } catch (error) {
            next(error)
        }
    }

    async uploadPhoto(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const token = req.cookies.tutor.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "tutor";
            const tutorId: string | null = decodedToken(token, requiredRole);
            let fileLocation = (req.file as any).location; 
            const tutor = await this.tutorService.uploadPhoto(tutorId,fileLocation);
            res.status(201).json({
                success:true,
                message:"Profile photo updated",
                data:tutor
            })
        }catch(error){
            next(error);
        }
    }

    async updateProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const token = req.cookies.tutor.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "tutor";
            const tutorId: string | null = decodedToken(token, requiredRole);
            const { tutorname, experiance, education } = req.body;
            const updatedTutor = await this.tutorService.updateProfile(tutorId, {
                tutorname,
                experiance,
                education
            });     
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedTutor
            });
           }catch(error){

        }
    }

    async Logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            res.clearCookie('tutor', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error)
        }
    }

 
}