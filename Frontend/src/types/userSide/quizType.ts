export enum DifficultyLevel {
    BEGINNER = 'Beginner',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
  }
  
  export enum TechStack {
    FRONTEND = 'Frontend',
    BACKEND = 'Backend',
    FULLSTACK = 'Full Stack',
    DATASCIENCE = 'Data Science',
    CLOUDCOMPUTING = 'Cloud Computing'
  }
  
  export enum InstitutionType {
    ONLINE_PLATFORM = 'Online Learning Platform',
    CODING_BOOTCAMP = 'Coding Bootcamp',
    PROFESSIONAL_TRAINING = 'Professional Training',
    UNIVERSITY = 'University',
    CORPORATE_TRAINING = 'Corporate Training'
  }
  
  export interface Quiz {
    id: number;
    institution: string;
    institutionType: InstitutionType;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    stack: TechStack;
    time: string;
    questions: number;
    rating: number;
  }
  
  export interface QuizFilter {
    difficulty: DifficultyLevel | '';
    stack: TechStack | '';
    institution: string;
  }

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttemptProps {
  quiz: Quiz;
}