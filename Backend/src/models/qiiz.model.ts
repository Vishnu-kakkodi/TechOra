import { Schema, model, Document } from "mongoose";
import { QuizDocument, Question } from "../interfaces/quiz.interface";

const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  explanation: {
    type: String,
    required: false
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
}, { timestamps: true });

const quizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  institutionId: {
    type: Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  maxAttempts: {
    type: Number,
    required: true,
    default: 3
  },
  thumbnailQuiz: { 
    type: String, 
    required: true 
  },
  questions: {
    type: [questionSchema],
    default: [],
    validate: [{
      validator: function(this: QuizDocument, questions: Question[]): boolean {
        if (this.status === 'published') {
          return questions.length > 0;
        }
        return true;
      },
      message: 'Published quizzes must have at least one question'
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    required: true
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
}, { timestamps: true });


export const QuizModel = model<QuizDocument>('Quiz', quizSchema);