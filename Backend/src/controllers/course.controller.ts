import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { CreateCourseDto, UpdateCourseDto } from "../dtos/course.dtos";
import { CourseDetailResponse, CourseDetailResponseInstitute, Module } from "../type/course.type";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ICourseService } from "../interfaces/IServiceInterface/ICourseService";
import { IQuizService } from "../interfaces/IServiceInterface/IQuizService";

export class CourseController {
    private courseService: ICourseService;
    private quizService: IQuizService;

    constructor(courseService: ICourseService, quizService: IQuizService) {
        this.courseService = courseService;
        this.quizService = quizService;
    }

    public createCourse = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tutorId: string | null = req.user?._id;
            const courseData: CreateCourseDto = req.body;

            if (!courseData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }

            if (req.file) {
                courseData.thumbnail = (req.file as any).location;
            } else {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }

            if (!courseData.institutionId) {
                throw new HttpException(400, 'Institute ID is required');
            }

            const course = await this.courseService.createCourse(courseData,tutorId);

            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.COURSE_CREATED,
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
        try {
            const institutionId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const course = await this.courseService.draftCourse({institutionId},page,limit,search)
            res.status(201).json({
                message: "Approved",
                data: course
            })
        } catch (error) {
            next(error);
        }
    }

    public draftCourses = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tutorId: string | null = req.user?._id
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const course = await this.courseService.draftCourse({tutorId},page,limit,search)
            res.status(201).json({
                message: "Approved",
                data: course
            })
        } catch (error) {
            next(error);
        }
    }

    public createModule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {
            const courseData: Module = req.body;
            if (!courseData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            if (req.file) {
                courseData.video = (req.file as any).location;
            } else {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            const course = await this.courseService.createModule(courseData.draftId, courseData)
            res.status(201).json({
                message: "Approved",
                data: course
            })
        } catch (error) {
            next(error);
        }
    }

    public courseList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const instituteId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const {course,total} = await this.courseService.courseList(instituteId,page,limit,search,filter,sort);
            res.status(201).json({
                course,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error)
        }
    }

    public TutorCourseList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tutorId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const {course,total} = await this.courseService.TutorCourseList(tutorId,page,limit,search,filter,sort);
            res.status(201).json({
                course,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
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
            const userId: string | null = req.user?._id;
            const data = await this.courseService.PurchasedCourse(userId);
            const purchased: string | undefined = (data?.purchasedCourses)?.toString();
            const purchasedCourses = purchased?.split(",");
            const { courseId } = req.params
            const course = await this.courseService.courseDetail(courseId);

            const response: CourseDetailResponse = {
                message: "Success",
                Data: course,
                purchased: purchasedCourses,
            };
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }


    public courseDetailInstitute = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { courseId } = req.params
            const course = await this.courseService.courseDetail(courseId);
            const response: CourseDetailResponseInstitute = {
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
    ): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const {course,total,department,totalCourse} = await this.courseService.userCorseList(page,limit,search,filter,sort);
            if(!course){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json({
                course,
                total,
                department,
                totalCourse,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error);
        }
    }

    public courseAction = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const courseId = req.body.courseId;
            if(!courseId){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            const information = await this.courseService.courseAction(courseId);

            if(!information){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json({
                message: information
            });
        } catch (error) {
            next(error);
        }
    }


    public updateCourse = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const courseData: UpdateCourseDto = req.body;
            const courseId:string = req.query.courseId as string;
            if (!courseData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            await this.courseService.updateCourse(courseData,courseId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: "Course Updated",
            });
        } catch (error) {
            next(error);
        }
    }


    public moduleDelete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const courseId = req.query.courseId as string;
            const moduleId = req.query.moduleId as string;
            if(!courseId){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            await this.courseService.moduleDelete(courseId,moduleId);
            res.status(201).json({
                message: "Module Deleted"
            });
        } catch (error) {
            next(error);
        }
    }

    public chartData = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const instituteId: string | null = req.user?._id;
            const {published,draft,listed,unlisted,course} = await this.courseService.chartData(instituteId);
            const quiz = await this.quizService.findQuiz(instituteId);
            res.status(201).json({published,draft,listed,unlisted,course,quiz});
        } catch (error) {
            next(error)
        }
    }
}




