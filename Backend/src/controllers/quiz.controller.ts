import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service";
import {QuizDocument} from "../interfaces/quiz.interface";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { HttpException } from "../middleware/error.middleware";


export class QuizController {
    private quizService: QuizService;

    constructor(quizService: QuizService) {
        this.quizService = quizService;
    }

    public createQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = req.cookies.institute.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "institute";
            const institutionId: string | null = decodedToken(token, requiredRole);
            const quizData: QuizDocument = req.body;
            if (!quizData) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            await this.quizService.createQuiz(quizData,institutionId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
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
            const token = req.cookies.institute.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "institute";
            const institutionId: string | null = decodedToken(token, requiredRole);
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
            const token = req.cookies.institute.accessToken;
            if(!token){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED,MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "institute";
            const institutionId: string | null = decodedToken(token, requiredRole);
            const quizData: QuizDocument = req.body;
            if (!quizData) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            const quizId = (req.query.quizId as string);
            await this.quizService.updateQuiz(quizData,institutionId,quizId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.QUIZ_UPDATED,
            });
        }catch(error){
            next(error);
        }
    }

}