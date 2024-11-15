import { Request, Response, NextFunction } from "express";
import { InstituteService } from "../services/institute.service";
import { CreateUserDto, CreateTutorDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { generateToken } from "../utils/generateToken";
import { CreateCourseDto } from "../dtos/course.dtos";

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
            const CookieData: string = req.cookies.institutionOTP;
            console.log(CookieData);
            const response = await this.instituteService.verifyOtp(otp,CookieData[0]);
            const email = CookieData[1]
            if(response){
                res.clearCookie('userData');
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
            res.cookie('instituteCredential', institute, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000
            });
            res.status(201).json({institute, message:'Successfull'});
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
            res.cookie('instituteCredential', institute, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 25 * 60 * 1000
            });
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
            const instituteId = req.query.id as string;
            const tutorDetail = req.body;
            console.log(instituteId,tutorDetail,"Data")
            const tutorData = {
                ...tutorDetail,
                instituteId
            }
            const tutor = this.instituteService.createTutor(tutorData)
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