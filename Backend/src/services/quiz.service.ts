import { HttpException } from "../middleware/error.middleware";
import mongoose, { FilterQuery } from "mongoose";
import { QuizRepository } from "../repositories/quiz.repository";
import { QuizDocument } from "../type/quiz.type";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { UserRepository } from "../repositories/user.repository";
import { TutorRepository } from "../repositories/tutor.repository";
import { IQuizService } from "../interfaces/IServiceInterface/IQuizService";
import { IQuizRepository } from "../interfaces/IRepositoryInterface/IQuizRepository";
import { IUserRepository } from "../interfaces/IRepositoryInterface/IUserRepository";
import { ITutorRepository } from "../interfaces/IRepositoryInterface/ITutorRepository";
import { TutorDocument } from "../type/tutor.type";



class QuizService implements IQuizService {
    private quizRepository: IQuizRepository;
    private userRepository: IUserRepository;
    private tutorRepository: ITutorRepository;


    constructor(quizRepository: IQuizRepository, userRepository: IUserRepository, tutorRepository: ITutorRepository) {
        this.quizRepository = quizRepository;
        this.userRepository  = userRepository;
        this.tutorRepository =  tutorRepository;

    }


    async createQuiz(quizData: QuizDocument,tutorId: string): Promise<unknown> {
        try {
            if(!tutorId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              const tutorData = await this.tutorRepository.findById(tutorId)
            const newItem:  Partial<QuizDocument> = {
                    ...quizData,
                    institutionId: new mongoose.Types.ObjectId(tutorData?.institutionId),
                    tutorId: new mongoose.Types.ObjectId(tutorId)
            };
            const createdQuiz = await this.quizRepository.create(newItem);
            return createdQuiz._id 
        } catch (error) {
            throw error;
        }

    }

    async quizList(page:number,limit:number,search:string,department:string,sort:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
        try {
            const skip = (page - 1) * limit;
            let query: FilterQuery<QuizDocument> = {};
            let sortOptions: Record<string, 1 | -1> = {};
      
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
      
      
                ];
            }

            if (department && department.trim() !== '') {
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
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }

    }

    async listQuiz(institutionId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
        try {
            const skip = (page - 1) * limit;
            let query: FilterQuery<QuizDocument> = {};
            let sortOptions: Record<string, 1 | -1> = {};
      
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }   
                ];
            }

            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep)=>dep.trim());            
                query.department = { $in:departmentArray };
            }

            if (selectedStatus && selectedStatus.trim() !== '') {                
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
            return await this.quizRepository.findQuizz("institutionId",institutionId,query,skip,limit,sortOptions);
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }

    }


    async TutorListQuiz(tutorId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
        try {
            const skip = (page - 1) * limit;
            let query: FilterQuery<TutorDocument> = {};
            let sortOptions: Record<string, 1 | -1> = {};
      
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }   
                ];
            }

            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep)=>dep.trim());            
                query.department = { $in:departmentArray };
            }

            if (selectedStatus && selectedStatus.trim() !== '') {                
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
            return await this.quizRepository.findQuizz("tutorId",tutorId,query,skip,limit,sortOptions);
        } catch (error) {
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
            throw error;
        }
    }

    async updateQuiz(quizData: QuizDocument,quizId:string): Promise<void> {
        try {
            return await this.quizRepository.UpdateQuiz(quizData,quizId);
        } catch (error) {
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
            throw error;
        }
    }

    async quizResult(userId: string, mark: string, quizId: string): Promise<void> {
        try {
            if(!userId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
            const user = await this.userRepository.findById(userId);
            const quiz: QuizDocument | null = await this.quizRepository.findQuiz(quizId);
            if(quiz){
                quiz.isComplete.push(userId)
                await quiz.save();
            }
            if(user){
                let point = Math.abs(Number(mark));
                if(mark.startsWith('+')){
                    user.quizProgress.score = user.quizProgress.score + point;
                
                }else if(mark.startsWith('-')){
                    user.quizProgress.score = user.quizProgress.score - point;
                }
                user.quizProgress.progress = mark;
                await user.save();
            }

            await this.userRepository.updateRank();

            return

        } catch (error) {
            throw error;
        }
    }


}

export default QuizService;