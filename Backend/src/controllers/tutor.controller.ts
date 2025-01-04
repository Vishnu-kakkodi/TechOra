import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ITutorService } from "../interfaces/IServiceInterface/ITutorService";

export class TutorController{
    private tutorService: ITutorService
    constructor(tutorService: ITutorService){
        this.tutorService = tutorService
    }
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
            const tutorId: string | null = req.user?._id;
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
            const tutorId: string | null = req.user?._id;
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

    async enrolledStudents(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const tutorId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const {users,total} = await this.tutorService.enrolledStudents(tutorId,page,limit,search);
            if (!users) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              res.status(201).json({
                users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error)
        }
    }

    async recentActivity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const tutorId: string | null = req.user?._id;
            const data = await this.tutorService.recentActivity(tutorId);
            if (!data) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              res.status(201).json({
                data
            });
        } catch (error) {
            next(error)
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