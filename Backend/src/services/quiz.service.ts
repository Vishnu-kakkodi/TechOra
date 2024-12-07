import { HttpException } from "../middleware/error.middleware";
import mongoose from "mongoose";
import { QuizRepository } from "../repositories/quiz.repository";
import { QuizDocument } from "../interfaces/quiz.interface";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";



export class QuizService {
    private quizRepository: QuizRepository;

    constructor(quizRepository: QuizRepository) {
        this.quizRepository = quizRepository;
    }


    async createQuiz(quizData: QuizDocument,institutionId: string): Promise<void> {
        try {
            if(!institutionId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            const newItem:  Partial<QuizDocument> = {
                    ...quizData,
                    institutionId: new mongoose.Types.ObjectId(institutionId)
            };
            await this.quizRepository.create(newItem);
            return 
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }

    }

    async quizList(page:number,limit:number,search:string,department:string,sort:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
        try {
            const skip = (page - 1) * limit;
            let query:any = {};
            let sortOptions: any = {};
      
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
      
      
                ];
            }

            if (department && department.trim() !== '') {
                console.log('Status received:', department);
                const departmentArray = department.split(',').map((dep)=>dep.trim());
                
                query.department = { $in:departmentArray };
            }

            switch(sort) {
                case 'newest':
                  sortOptions = { createdAt: -1 };
                  break;
                case 'oldest':
                  sortOptions = { createdAt: 1 };
                  break;
                default:
                  sortOptions = { createdAt: -1 };
              }

              
            return await this.quizRepository.find(query,skip,limit,sortOptions);
        } catch (error) {
            console.error('Error creating course:', error);
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }

    }

    async listQuiz(institutionId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
        try {
            const skip = (page - 1) * limit;
            let query:any = {};
            let sortOptions: any = {};
      
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }   
                ];
            }

            if (department && department.trim() !== '') {
                console.log('Status received:', department);
                const departmentArray = department.split(',').map((dep)=>dep.trim());            
                query.department = { $in:departmentArray };
            }

            if (selectedStatus && selectedStatus.trim() !== '') {
                console.log('Status received:', selectedStatus);
                
                query.status = { $regex: new RegExp(`^${selectedStatus}$`, 'i') };
            }

            switch(sort) {
                case 'newest':
                  sortOptions = { createdAt: -1 };
                  break;
                case 'oldest':
                  sortOptions = { createdAt: 1 };
                  break;
                default:
                  sortOptions = { createdAt: -1 };
              }
            return await this.quizRepository.findOne(institutionId,query,skip,limit,sortOptions);
        } catch (error) {
            console.error('Error creating course:', error);
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }

    }

    
    async quizDetail(quizId: string): Promise<QuizDocument|null> {
        try {
            if(!quizId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            return await this.quizRepository.findQuiz(quizId);
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    async updateQuiz(quizData: QuizDocument,institutionId: string,quizId:string): Promise<void> {
        try {
            if(!institutionId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            await this.quizRepository.UpdateQuiz(quizData,quizId);

            // if(quizData.title){
            //     existingQuiz.title = quizData.title
            // }
            // if(quizData.description){
            //     existingQuiz.description = quizData.description
            // }
            // if(quizData.department){
            //     existingQuiz.department = quizData.department
            // }
            // if(quizData.difficultyLevel){
            //     existingQuiz.difficultyLevel = quizData.difficultyLevel
            // }
            // if(quizData.passingScore){
            //     existingQuiz.passingScore = quizData.passingScore
            // }
            // if(quizData.positiveScore){
            //     existingQuiz.positiveScore = quizData.positiveScore
            // }
            // if(quizData.negativeScore){
            //     existingQuiz.negativeScore = quizData.negativeScore
            // }
            // if(quizData.stack){
            //     existingQuiz.stack = quizData.stack
            // }
            // if(quizData.startDate){
            //     existingQuiz.startDate = quizData.startDate
            // }
            // if(quizData.duration){
            //     existingQuiz.duration = quizData.duration
            // }
            // if(quizData.maxAttempts){
            //     existingQuiz.maxAttempts = quizData.maxAttempts
            // }
            // if(quizData.totalQuestions){
            //     existingQuiz.totalQuestions = quizData.totalQuestions
            // }
            return

        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }


    async findQuiz(instituteId: string): Promise<QuizDocument[]> {
        try {
            if(!instituteId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            return await this.quizRepository.findLatestQuiz(instituteId);
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }


}