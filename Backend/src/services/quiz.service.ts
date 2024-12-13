import { HttpException } from "../middleware/error.middleware";
import mongoose from "mongoose";
import { QuizRepository } from "../repositories/quiz.repository";
import { QuizDocument } from "../interfaces/quiz.interface";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { UserRepository } from "../repositories/user.repository";
import { TutorRepository } from "../repositories/tutor.repository";



export class QuizService {
    private quizRepository: QuizRepository;
    private userRepository: UserRepository;
    private tutorRepository: TutorRepository;


    constructor(quizRepository: QuizRepository, userRepository: UserRepository, tutorRepository: TutorRepository) {
        this.quizRepository = quizRepository;
        this.userRepository  = userRepository;
        this.tutorRepository =  tutorRepository;

    }


    async createQuiz(quizData: QuizDocument,tutorId: string): Promise<void> {
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
            return await this.quizRepository.findQuizz("institutionId",institutionId,query,skip,limit,sortOptions);
        } catch (error) {
            console.error('Error creating course:', error);
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }

    }


    async TutorListQuiz(tutorId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }> {
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
            return await this.quizRepository.findQuizz("tutorId",tutorId,query,skip,limit,sortOptions);
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

    async updateQuiz(quizData: QuizDocument,quizId:string): Promise<void> {
        try {
            return await this.quizRepository.UpdateQuiz(quizData,quizId);
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

    async quizResult(userId: string, mark: string, quizId: string): Promise<void> {
        try {
            if(!userId){
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
              }
              console.log(mark)
            const user = await this.userRepository.findById(userId);
            const quiz: QuizDocument | null = await this.quizRepository.findQuiz(quizId);
            console.log(quiz);
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
            console.error('Error creating course:', error);
            throw error;
        }
    }


}