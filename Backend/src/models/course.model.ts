import { Schema, model, Document } from "mongoose";
import { CourseDocument, Module } from "../interfaces/course.interface";


const moduleSchema = new Schema<Module>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number,
    required: true 
  },
  video: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['list', 'unlist'], 
    default: 'unlist' 
  }
}, { timestamps: true });

const courseSchema = new Schema<CourseDocument>({
  title: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  tutorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tutor', 
    required: true 
  },
  duration: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft', 
    required: true 
  },
  thumbnail: { 
    type: String, 
    required: true 
  },
  institutionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Institute', 
    required: true 
  },
  modules: {
    type: [moduleSchema],
    default: [],
    validate: [{
      validator: function(this: CourseDocument, modules: Module[]): boolean {
        if (this.status === 'published') {
          return modules.length > 0;
        }
        return true;
      },
      message: 'Published courses must have at least one module'
    }]
  },
  totalModules: { 
    type: Number, 
    default: 0 
  },
  totalDuration: { 
    type: Number,
    default: 0 
  },
  isListed:{
    type:Boolean,
    default:true
  }
}, { timestamps: true });

courseSchema.pre('save', function(this: CourseDocument, next) {
  if (this.modules) {
    this.totalModules = this.modules.length;
    this.totalDuration = this.modules.reduce((total, module) => total + module.duration, 0);
  }
  
  if (this.status === 'published' && (!this.modules || this.modules.length === 0)) {
    next(new Error('Cannot publish a course without modules'));
    return;
  }
  
  next();
});

courseSchema.pre('validate', function(this: CourseDocument, next) {
  if (this.status === 'draft') {
    const hasUnpublishedModules = this.modules.some(module => module.status === 'unlist');
    if (hasUnpublishedModules) {
      next(new Error('Cannot publish course with draft modules'));
      return;
    }
  }
  next();
});

export const CourseModel = model<CourseDocument>('Course', courseSchema);