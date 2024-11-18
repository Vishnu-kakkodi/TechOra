import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";

export type QuestionType = 'multiple' | 'boolean' | 'text';

export interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options: string[];
    correctAnswer: number | string;
    explanation?: string;
}

export interface Quiz extends BaseInterface {
    title: string;
    description: string;
    stack: 'English' | 'Maths' | 'Science' | 'General';
    difficulty: 'Hard' | 'Medium' | 'Easy';
    department: string;
    institutionId: Types.ObjectId | string;
    duration: number; 
    startDate?: Date;
    endDate?: Date;
    status: 'draft' | 'published';
    thumbnailQuiz?: string;
    questionType: QuestionType;
    maxQuestions: number;
    passingScore?: number;
    questions: Question[];
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

export type QuizDocument = Quiz & Document;


export type CreateQuizDTO = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'totalQuestions'>;

export type UpdateQuizDTO = Partial<CreateQuizDTO>;
