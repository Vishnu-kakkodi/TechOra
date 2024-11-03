import { Schema, model, Document } from 'mongoose';
import { InstituteDocument } from '../interfaces/institute.interface';

const instituteSchema = new Schema<InstituteDocument>(
  {
    collegeName: { type: String, required: true },
    instituteEmail: { type: String, required: true, unique: true },
    collegeCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true }
  },
  { timestamps: true }
);

export const InstituteModel = model<InstituteDocument>('Institute', instituteSchema);
