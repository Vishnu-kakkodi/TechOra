import { Request, Response, NextFunction } from "express";
import { CreateUserDto, CreateTutorDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IInstituteService } from "../interfaces/IServiceInterface/IInsrituteService";

export class InstitutionController{
    private instituteService: IInstituteService
    constructor(instituteService: IInstituteService){
        this.instituteService = instituteService
    }
    async trackStatus(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const trackID:string = req.body.trackID;
            if (!trackID) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const response = await this.instituteService.trackStatus(trackID);
            if(!response){
                res.status(401).json({
                    message: "Application is active"
                })
            }
            res.status(201).json({
                message:"Success",
                data: response
            })
        }catch(error){
            next(error)
        }

    }

    async verifyEmail(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try {
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
            next(error)
        }
    }

    async verifyOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const { otp } = req.body;
            if(!otp){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
            }
            const CookieData: string = req.cookies.institutionOTP;
            if (!CookieData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const response = await this.instituteService.verifyOtp(otp,CookieData[0]);
            if (!response) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const email = CookieData[1]
            if(response){
                res.clearCookie('institutionOTP');
                res.status(201).json({email,message:'Successfull'});
            }
        }catch(error){
            next(error)
        }
    }

    async createInstitute(
        req: Request<{}, {}, CreateUserDto>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
              const fileLocation = (req.file as Express.Multer.File & { location?: string })?.location;
              if (!fileLocation) {
                 res.status(400).json({ message: "File upload failed." });
              }
            const instituteData = {
                ...req.body,
                documentUrl: fileLocation,
              };
            const institute = await this.instituteService.createInstitute(instituteData);
            if (!institute) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            const Token ={
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            setCookie(res,'institute',Token);

            res.status(201).json({instituteDetails, message:'Successfull'});
        }catch(error){
            next(error)
        }
    }

    async getInstitution(
        req: Request<{ email: string, collegeCode: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail,req.body.collegeCode);
            if (!institute) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            const Token ={
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res,'institute',Token);
            res.json({ institute,message:"Login successfully" });
        } catch (error) {
            next(error)
        }
    }

    async createTutor(
        req: Request<{}, {}, CreateTutorDto>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const institutionId: string | null = req.user?._id;
            const tutorDetail = req.body;
            const tutorData = {
                ...tutorDetail,
                institutionId
            }
            await this.instituteService.createTutor(tutorData)
            res.status(201).json({
                status: 'success',
                message: 'Tutor created successfully'
            });
        }catch(error){
            next(error)
        }
    }


    async tutorList(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const institutionId: string | null = req.user?._id;
            const institutes = await this.instituteService.tutorList(institutionId);
            if (!institutes) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            res.status(201).json({
                institutes
            });
        }catch(error){
            next(error)
        }
    }

    async addDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try{
            const institutionId: string | null = req.user?._id;
            const institutes = await this.instituteService.tutorList(institutionId);
            if (!institutes) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            const {department} = req.body;
            await this.instituteService.addDepartment(institutionId,department)
            res.status(201).json({status:'success',message:"Department added"});

        }catch(error){
            next(error)
        }
    }

    async getDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>
{
    try{
        const institutionId: string | null = req.user?._id;
        const institutes = await this.instituteService.tutorList(institutionId);
        if (!institutes) {
            throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 4;
        const search = (req.query.search as string) || '';
        const {departments,total} = await this.instituteService.getDepartment(institutionId,page,limit,search);
        res.status(201).json({status:'success',message:"Department added", data: {departments,total}});

    }catch(error){
        next(error)
    }
}    

    async Logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            res.clearCookie('institute', {
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