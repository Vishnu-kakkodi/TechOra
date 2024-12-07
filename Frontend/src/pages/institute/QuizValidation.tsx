import * as Yup from 'yup';
import { QuizData, QuestionType } from '../../types/quizType';

export const QuizValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Quiz title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters'),
  
  duration: Yup.number()
    .required('Duration is required')
    .min(10, 'Minimum quiz duration is 10 minutes')
    .max(180, 'Maximum quiz duration is 3 hours'),
  
  maxAttempts: Yup.number()
    .required('Max attempts is required')
    .min(1, 'At least one attempt is required')
    .max(5, 'Maximum 5 attempts allowed'),
  
  department: Yup.string()
    .required('Department selection is required'),
  
  difficultyLevel: Yup.string()
    .required('Difficulty level is required')
    .oneOf(['easy', 'medium', 'hard'], 'Invalid difficulty level'),
  
  positiveScore: Yup.number()
    .required('Positive score is required')
    .min(1, 'Minimum positive score is 1')
    .max(4, 'Maximum positive score is 4'),
  
  negativeScore: Yup.number()
    .required('Negative score is required')
    .min(0, 'Negative score cannot be negative')
    .max(1, 'Maximum negative score is 1'),
  
  passingScore: Yup.number()
    .required('Passing score is required')
    .min(1, 'Passing score must be at least 1'),
  
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  
  questions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string()
        .required('Question text is required')
        .min(5, 'Question must be at least 5 characters')
        .max(500, 'Question must not exceed 500 characters'),
      
      type: Yup.string()
        .oneOf(['multiple-choice', 'true-false', 'short-answer'], 'Invalid question type'),
      
      options: Yup.lazy((value: any) => {
        const questionType = value?.[0]?.type || 'multiple-choice';
        
        switch(questionType) {
          case 'multiple-choice':
            return Yup.array()
              .of(
                Yup.object().shape({
                  text: Yup.string()
                    .required('Option text is required')
                    .min(1, 'Option must not be empty'),
                  isCorrect: Yup.boolean()
                })
              )
              .min(4, 'Multiple choice questions must have 4 options')
              .test(
                'at-least-one-correct',
                'At least one option must be marked as correct',
                (options) => options?.some(option => option.isCorrect)
              );
          
          case 'true-false':
            return Yup.array()
              .of(
                Yup.object().shape({
                  text: Yup.string().oneOf(['True', 'False']),
                  isCorrect: Yup.boolean()
                })
              )
              .test(
                'one-correct-answer',
                'Exactly one option must be marked as correct',
                (options) => options?.filter(option => option.isCorrect).length === 1
              );
          
          case 'short-answer':
            return Yup.array()
              .of(
                Yup.object().shape({
                  text: Yup.string()
                    .required('Short answer is required')
                    .min(1, 'Answer must not be empty')
                })
              )
              .max(1, 'Short answer can have only one option');
          
          default:
            return Yup.array();
        }
      }),
      
      explanation: Yup.string()
        .max(1000, 'Explanation must not exceed 1000 characters')
    })
  )
  .min(1, 'At least one question is required')
  .max(20, 'Maximum 20 questions allowed'),
});

export const validateQuiz = (quizData: QuizData): { isValid: boolean; errors?: any } => {
  try {
    QuizValidationSchema.validateSync(quizData, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.reduce((acc, curr) => {
        acc[curr.path || ''] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { 
        isValid: false, 
        errors 
      };
    }
    return { isValid: false };
  }
};