import { BaseRepository } from "./base.repository";
import { QuizModel } from "../models/qiiz.model";
import { QuizDocument } from "../type/quiz.type";
import mongoose, { FilterQuery } from "mongoose";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import { IQuizRepository } from "../interfaces/IRepositoryInterface/IQuizRepository";

export type SearchQuiz = FilterQuery<{
    title: string;
    department: string;
    stack: string;
}>;

export class QuizRepository extends BaseRepository<QuizDocument> implements IQuizRepository {
    constructor() {
        super(QuizModel);
    }

    async find(searchQuery: SearchQuiz, skip: number, limit: number, sortOptions: any = { createdAt: -1 }): Promise<{ quiz: QuizDocument[]; total: number; department: string[] }> {
        try {
            const quiz = await this.model.find({ status: 'published', ...searchQuery })
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('institutionId');
            const total: number = await this.model.countDocuments({ status: 'published' }, searchQuery);
            const department: string[] = await this.model.distinct("department");

            return { quiz, total, department }
        } catch (error) {
            throw error;
        }
    }
    async findQuizzes(): Promise<QuizDocument[]> {
        try {
            return await this.model.find()
                .populate('institutionId');

        } catch (error) {
            throw error;
        }
    }


    async findQuizz(
        filterKey: string,
        filterValue: string,
        searchQuery: SearchQuiz,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
    ): Promise<{ quiz: QuizDocument[]; total: number; department: string[] }> {
        try {
            const needsObjectId = ['tutorId', '_id', 'institutionId'].includes(filterKey);
            const filterQuery = needsObjectId
                ? new mongoose.Types.ObjectId(filterValue)
                : filterValue;

            const baseFilter = {
                [filterKey]: filterQuery,
                status: 'published'
            };

            const filter = {
                ...baseFilter,
                ...(searchQuery || {})
            };

            const quiz = await this.model.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'institutionId'
                });

            const total = await this.model.countDocuments(filter);
            const department = await this.model.distinct("department");

            return { quiz, total, department };
        } catch (error) {
            throw error;
        }
    }


    async findQuiz(quizId: string): Promise<QuizDocument | null> {
        try {
            const id = new mongoose.Types.ObjectId(quizId)
            return await this.model.findOne(id)
                .populate({
                    path: 'institutionId'
                });
        } catch (error) {
            throw error;
        }
    }

    async findLatestQuiz(instituteId: string): Promise<QuizDocument[]> {
        try {
            return await this.model.find({ institutionId: instituteId })
                .sort({ createdAt: -1 })
                .limit(4)
                .populate({
                    path: 'institutionId'
                });
        } catch (error) {
            throw error;
        }
    }


    async UpdateQuiz(quizData: QuizDocument, quizId: string): Promise<void> {
        try {
            const id = new mongoose.Types.ObjectId(quizId)
            const existingQuiz = await this.model.findOne(id)
                .populate({
                    path: 'institutionId'
                });

            if (!existingQuiz) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, 'Quiz not found');
            }

            const fieldsToUpdate: (keyof QuizDocument)[] = [
                'title', 'description', 'department', 'difficultyLevel',
                'passingScore', 'positiveScore', 'negativeScore',
                'stack', 'startDate', 'duration', 'maxAttempts', 'totalQuestions', 'status'
            ];

            fieldsToUpdate.forEach(field => {
                if (quizData[field] !== undefined) {
                    (existingQuiz[field] as any) = quizData[field];
                }
            });

            quizData.questions.map((q) => console.log(q._id, "oo"))


            if (quizData.questions && Array.isArray(quizData.questions)) {
                quizData.questions.forEach(updatedQuestion => {
                    if (updatedQuestion._id) {
                        const index = existingQuiz.questions.findIndex(
                            q => q._id.toString() === updatedQuestion._id.toString()
                        );
                        if (index !== -1) {
                            existingQuiz.questions[index] = {
                                ...existingQuiz.questions[index],
                                ...updatedQuestion
                            };
                        }
                    } else {
                        existingQuiz.questions.push({
                            ...updatedQuestion,
                            _id: new mongoose.Types.ObjectId()
                        });
                    }
                });
            }

            await existingQuiz.save();
            return
        } catch (error) {
            throw error;
        }
    }
}