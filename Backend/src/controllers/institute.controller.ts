import { Request, Response, NextFunction } from "express";
import { InstituteService } from "../services/institute.service";
import { CreateUserDto, CreateTutorDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { decodedToken } from "../helperFunction/authHelper";

export class InstitutionController{
    constructor(private readonly instituteService: InstituteService){}


    async trackStatus(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{

        try{
            const trackID:string = req.body.trackID;
            console.log(trackID)
            const response = await this.instituteService.trackStatus(trackID);
            console.log(response,"yy")
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
            const CookieData: string = req.cookies.institutionOTP;
            console.log(CookieData);
            const response = await this.instituteService.verifyOtp(otp,CookieData[0]);
            const email = CookieData[1]
            if(response){
                res.clearCookie('institutionOTP');
                res.status(201).json({email,message:'Successfull'});
            }
        }catch(error){
            next(error);
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
            console.log(req.file,"File name");
            console.log(req.body,"controller")
            console.log("Hai")

            const instituteData = {
                ...req.body,
                documentUrl: fileLocation,
              };
            const institute = await this.instituteService.createInstitute(instituteData);
            console.log(institute,"ggggggggggggggggggggg")
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            console.log(instituteDetails,"Institute")
            const Token ={
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            setCookie(res, 'institute', Token);

            res.status(201).json({instituteDetails, message:'Successfull'});
        }catch(error){
            next(error);
        }
    }

    async getInstitution(
        req: Request<{ email: string, collegeCode: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail,req.body.collegeCode);
            console.log(institute,"yyyyyyyyyyyyyyyyyyyyyy")
            if (!institute) {
                throw new HttpException(404, 'Institution not found');
            }
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            console.log(instituteDetails,"Institute")
            const Token ={
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            setCookie(res, 'institute', Token);

            res.json({ institute,message:"Login successfully" });
        } catch (error) {
            next(error);
        }
    }

    async createTutor(
        req: Request<{}, {}, CreateTutorDto>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            console.log("data");
            const token = req.cookies.institute.accessToken;
            const requiredRole = "institute";
            console.log(token,"Token")
            const institutionId: string | null = decodedToken(token, requiredRole);
            const tutorDetail = req.body;
            console.log(institutionId,tutorDetail,"Data")
            const tutorData = {
                ...tutorDetail,
                institutionId
            }
            console.log(tutorDetail)
            await this.instituteService.createTutor(tutorData)
            res.status(201).json({
                status: 'success',
                message: 'Tutor created successfully'
            });
        }catch(error){
            next(error);
        }
    }


    async tutorList(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const token = req.cookies.institute.accessToken;
            const requiredRole = "institute";
            console.log(token,"TokenGet")
            const institutionId: string | null = decodedToken(token, requiredRole);
            const institutes = await this.instituteService.tutorList(institutionId);
            console.log(institutes,"Ins")
            res.status(201).json({
                institutes
            });
        }catch(error){
            next(error);
        }
    }

    async createCourse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const courseData = req.body;
            
            if (req.file) {
                courseData.thumbnailUrl = (req.file as any).location;
            }
    
            console.log('Course Data:', courseData);
            
            res.status(201).json({
                status: 'success',
                message: 'Course created successfully', 
                data: courseData
            });
        } catch (error) {
            next(error);
        }
    }

 
}