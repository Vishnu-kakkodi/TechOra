import { Request, Response, NextFunction } from "express";
import {QuizDocument} from "../type/quiz.type";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { HttpException } from "../middleware/error.middleware";
import { IQuizService } from "../interfaces/IServiceInterface/IQuizService";


export class QuizController {
    private quizService: IQuizService;

    constructor(quizService: IQuizService) {
        this.quizService = quizService;
    }

    public createQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tutorId: string | null = req.user?._id;
            const quizData: QuizDocument = req.body;
            if (!quizData) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            const quizId = await this.quizService.createQuiz(quizData,tutorId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                data: quizId,
                message: MESSAGES.SUCCESS.QUIZ_CREATED,
            });
        } catch (error) {
            next(error)
        }
    }

    public quizList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const {quiz,total,department} = await this.quizService.quizList(page,limit,search,filter,sort);
            if (!quiz) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              res.status(201).json({
                quiz,
                total,
                department,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }catch(error){
            next(error)
        }
    }

    public listQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            const institutionId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const selectedStatus = (req.query.selectedStatus as string)
            const {quiz,total,department} = await this.quizService.listQuiz(institutionId,page,limit,search,filter,sort,selectedStatus);
            if (!quiz) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              res.status(201).json({
                quiz,
                total,
                department,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }catch(error){
            next(error)
        }
    }

    public TutorListQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try{
            const tutorId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const selectedStatus = (req.query.selectedStatus as string)
            const {quiz,total,department} = await this.quizService.TutorListQuiz(tutorId,page,limit,search,filter,sort,selectedStatus);
            if (!quiz) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              res.status(201).json({
                quiz,
                total,
                department,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }catch(error){
            next(error)
        }
    }

    public quizDetail =  async (
        req: Request,
        res:Response,
        next: NextFunction
    ):Promise<void> => {
        try{
            const quizId = (req.query.quizId as string);
            const quiz= await this.quizService.quizDetail(quizId);
            res.status(201).json({
                message:"Quiz Detail fetched succesfully",
                data:quiz
            });
        }catch(error){
            next(error);
        }
    }


    public updateQuiz =  async (
        req: Request,
        res:Response,
        next: NextFunction
    ):Promise<void> => {
        try{
            const quizData: QuizDocument = req.body;
            if (!quizData) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            const quizId = (req.query.quizId as string);
            await this.quizService.updateQuiz(quizData,quizId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.QUIZ_UPDATED,
            });
        }catch(error){
            next(error);
        }
    }

    public quizResult =  async (
        req: Request<{},{}>,
        res: Response,
        next: NextFunction
    ): Promise<void>=>{
        try{
            const userId: string | null = req.user?._id;
            const mark: string = req.body.mark;
            const quizId: string = req.body.quizId;
            await this.quizService.quizResult(userId,mark,quizId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: "Result Added"
            })
        }catch(error){
            next(error);
        }
    }

}