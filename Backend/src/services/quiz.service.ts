import { HttpException } from "../middleware/error.middleware";
import mongoose from "mongoose";
import { QuizRepository } from "../repositories/quiz.repository";
import { CreateQuizDTO, Quiz } from "../interfaces/quiz.interface";



export class QuizService {
    private quizRepository: QuizRepository;

    constructor(quizRepository: QuizRepository) {
        this.quizRepository = quizRepository;
    }


    async createQuiz(quizData: CreateQuizDTO): Promise<Quiz> {
        try {


            console.log('Creating course with data:', quizData);
            const response = await this.quizRepository.create(quizData);
            console.log('Course created:', response);
            return response;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    

    }

}