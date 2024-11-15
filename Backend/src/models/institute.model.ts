import { Schema, model, Document } from 'mongoose';
import { InstituteDocument, InstituteStatus } from '../interfaces/institute.interface';

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
    status: { type: String, enum: Object.values(InstituteStatus), default: InstituteStatus.Pending }

  },
  { timestamps: true }
);

export const InstituteModel = model<InstituteDocument>('Institute', instituteSchema);