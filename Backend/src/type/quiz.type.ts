import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.type";

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';
export type QuizStatus = 'draft' | 'published';

export interface Option {
    text: string;
    isCorrect: boolean;
}

export interface Question {
    _id: Types.ObjectId;
    question: string;
    options: Option[];
    explanation?: string;
    type: QuestionType;
}


export interface QuizData extends BaseInterface {
    institutionId?: Types.ObjectId,
    tutorId?: Types.ObjectId,
    title: string;
    description: string;
    duration: string;
    maxAttempts: string;
    questions: Question[];
    status: QuizStatus;
    totalQuestions: number;
    department?: string;
    stack?: string;
    difficultyLevel?: string;
    positiveScore?: number;
    negativeScore?: number;
    passingScore?: number;
    startDate?: string;
    isComplete:string[]
}


export type QuizDocument = QuizData & Document;



