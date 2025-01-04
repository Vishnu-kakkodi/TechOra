import { Schema, model, Document } from 'mongoose';
import { InstituteDocument, InstituteStatus } from '../type/institute.type';

const instituteSchema = new Schema<InstituteDocument>(
  {
    collegeName: { type: String, required: true },
    instituteEmail: { type: String, required: true, unique: true },
    collegeCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    documentUrl:{ type: String, required: true },
    applicationId:{ type: String, required: true},
    status: { type: String, enum: Object.values(InstituteStatus), default: InstituteStatus.Pending },
    totalStudents:{type: Number, required:false, default:0},
    department: { type: [String], required: false, default: [] },

  },
  { timestamps: true }
);

export const InstituteModel = model<InstituteDocument>('Institute', instituteSchema);
