import { Institute } from "./institutionTypes";

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';
export type QuizStatus = 'draft' | 'published';

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation?: string;
  type: QuestionType;
}
export interface QuestionBoxProps {
  index: number;
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation?: string;
  type: QuestionType;
}

export interface QuizData {
  _id:string;
  id:string
  title: string;
  description: string;
  duration: number;
  maxAttempts: number;
  questions: Question[];
  status: QuizStatus;
  totalQuestions: number;
  department?: string;
  stack?: string;
  difficultyLevel?: string;
  positiveScore?: number;
  negativeScore?: number;
  passingScore?: number;
  institutionId?: Institute
  startDate?: string;
  isComplete?: string[];
  createdAt :Date;

}

export interface QuizDatas {
  title: string;
  description: string;
  duration: number;
  maxAttempts: number;
  questions: Question[];
  status: QuizStatus;
  totalQuestions: number;
  department?: string;
  stack?: string;
  difficultyLevel?: string;
  positiveScore?: number;
  negativeScore?: number;
  passingScore?: number;
  institutionId?: Institute
  startDate?: string;
  isComplete?: string[];
}

export interface QuizListResponse {
  data: QuizData[];
  total?: number;
  department?: string[];
  totalCourse:number;
  page?: number;
  limit?: number;
  totalPages?:number;
}

export interface Quizdetail {
  message:string
  data:QuizDocument;
}


export type QuizDocument = QuizData;
