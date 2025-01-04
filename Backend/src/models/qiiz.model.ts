import { Schema, model, Document } from "mongoose";
import { QuizDocument, Question } from "../type/quiz.type";

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
    default: 'published'
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
  department:{
    type: String,
    required: true
  },
  difficultyLevel:{
    type: String,
    required: true
  },
  passingScore:{
    type: Number,
    required: true
  },
  positiveScore:{
    type: Number,
    required: true
  },
  negativeScore:{
    type: Number,
    required: true
  },
  stack:{
    type: String,
    required: true
  },
  startDate:{
    type: String,
    required: true
  },
  institutionId: {
    type: Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
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
    default: 'publishec',
    required: true
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  isComplete:[
{    type: Schema.Types.ObjectId,
     ref: 'User',
     required: true}
  ]
}, { timestamps: true });


export const QuizModel = model<QuizDocument>('Quiz', quizSchema);