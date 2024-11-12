import { Schema, model, Document } from "mongoose";
import { TutorDocument } from "../interfaces/tutor.interface";


const tutorSchema = new Schema<TutorDocument>({
    department: {type: String, required: true},
    tutorname: {type: String, required: true},
    education: {type: String, required: true},
    experiance: {type: String, required: true},
    gender: {type: String, required: true},
    institute: {type: Schema.Types.ObjectId, ref: 'Institute', required: true},
},
{ timestamps: true }
)

export const TutorModel = model('Tutor', tutorSchema);