// Type Definitions
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
  status: QuizStatus;
}

export interface QuizData {
  title: string;
  description: string;
  duration: string; 
  maxAttempts: string;
  thumbnailQuiz: File | null;
  questions: Question[];
  status: QuizStatus;
  totalQuestions: number;
}

export interface QuestionBoxProps {
  index: number;
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
}