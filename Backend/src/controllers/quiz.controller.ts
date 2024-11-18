import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service";
import { CreateQuizDTO } from "../interfaces/quiz.interface";


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
            console.log("Control")
            const quizData: CreateQuizDTO = req.body;

            if (req.file) {
                quizData.thumbnailQuiz = (req.file as any).location;
            }

            console.log('Course Data:', quizData.questions);
            const course = await this.quizService.createQuiz(quizData);
            res.status(201).json({
                status: 'success',
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            next(error);
        }
    }

}