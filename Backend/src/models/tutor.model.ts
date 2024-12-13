import { Schema, model, Document } from "mongoose";
import { TutorDocument } from "../interfaces/tutor.interface";


const tutorSchema = new Schema<TutorDocument>({
    department: {type: String, required: true},
    tutorname: {type: String, required: true},
    tutorEmail: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type:Boolean, required:true, default:false},
    education: {type: String, required: true},
    experiance: {type: String, required: true},
    gender: {type: String, required: true},
    institutionId: {type: Schema.Types.ObjectId, ref: 'Institute', required: true},
    profilePic: {type: String,required: false, default: ''},
},
{ timestamps: true }
)

export const TutorModel = model('Tutor', tutorSchema);