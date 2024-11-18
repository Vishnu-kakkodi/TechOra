import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { HttpException } from "../middleware/error.middleware";
import { CreateCourseDto } from "../dtos/course.dtos";
import { CourseDetailResponse, Module } from "../interfaces/course.interface";
import { decodedToken } from "../helperFunction/authHelper";

export class CourseController {
    private courseService: CourseService;

    constructor(courseService: CourseService) {
        this.courseService = courseService;
    }

    public createCourse = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            console.log("Control")
            const courseData: CreateCourseDto = req.body;

            if (req.file) {
                courseData.thumbnail = (req.file as any).location;
            }

            if (!courseData.institutionId) {
                throw new HttpException(400, 'Institute ID is required');
            }

            console.log('Course Data:', courseData);
            const course = await this.courseService.createCourse(courseData);
            res.status(201).json({
                status: 'success',
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            next(error);
        }
    }

    public draftCourse = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const Token = req.cookies.institute
        const token = Token.accessToken;
        const requiredRole = "institute";
        const instituteId: string | null = decodedToken(token, requiredRole);
        const course = await this.courseService.draftCourse(instituteId)

        res.status(201).json({
            message: "Approved",
            data: course
        })
        }catch(error){
            next(error);
        }

    }

    public createModule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try{
            const courseData: Module = req.body;

        if (req.file) {
            courseData.video = (req.file as any).location;
        }

        console.log(courseData, "oooooo");


        const course = await this.courseService.createModule(courseData.draftId, courseData)
        console.log(course, "Courseeeeeeeeeeeeeee")

        res.status(201).json({
            message: "Approved",
            data: course
        })
        }catch(error){
            next(error);
        }
    }

    public courseList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = req.cookies.institute.accessToken;
            const requiredRole = "institute";
            const instituteId: string | null = decodedToken(token, requiredRole);
            const course = await this.courseService.courseList(instituteId);

            res.status(201).json({
                message: "Course fetched successfully",
                data: course
            });
        } catch (error) {
            next(error)
        }
    }

    public courseDetail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { courseId } = req.params
            console.log(courseId, "{fdgfgsg}")
            const course = await this.courseService.courseDetail(courseId);
            console.log(course, "CourseDtatatat")

            const response: CourseDetailResponse = {
                message: "Success",
                Data: course,
            };


            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }

    public userCourseList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            console.log("RequestC");
            
            const course = await this.courseService.userCorseList();
            res.status(201).json({
                message: "Course fetched successfully",
                data: course
            });
        }catch(error){
            next(error);
        }
    }
}




