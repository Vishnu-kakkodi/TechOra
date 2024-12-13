import { Institute, InstituteDocument, InstituteStatus } from "../interfaces/institute.interface";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto } from "../dtos/institute.dtos";
import nodemailer from 'nodemailer';
import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import generator from "../utils/generateApplicationID";
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorDocument } from "../interfaces/tutor.interface";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";

export class TutorService {
    private tutorRepository: TutorRepository;
    constructor(tutorRepository: TutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    async tutorLogin(tutorEmail: string, password: string): Promise<TutorDocument | null> {
        try {
            if(!tutorEmail){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
              }
            const tutor = await this.tutorRepository.findOne(tutorEmail)
            if(!tutor){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            if (tutor.password !== password) {
                throw new HttpException(400, "Password mismatch");
            }
            // if (tutor.status !== InstituteStatus.Active) {
            //     throw new HttpException(400, "Institution does not exist");
            // }

            const accessToken = helperFunction.accesstoken(tutor.id, "tutor");
            const refreshToken = helperFunction.refreshtoken(tutor.id, "tutor");

            return { ...tutor.toObject(), accessToken, refreshToken };

        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async uploadPhoto(tutorId: string, fileLocation:string): Promise<TutorDocument | null>{
        try{
            const tutor = await this.tutorRepository.findById(tutorId)
            if (tutor) {
                tutor.profilePic = fileLocation;
                tutor.save();
            }
            return { ...tutor?.toObject()};

        }catch(error){
            throw error;
        }
    }

    async updateProfile(userId: string, updateData: {
        tutorname?: string;
        education?: string;
        experiance?: string;
    }): Promise<TutorDocument | null> {
        try {
            const updatedTutor = await this.tutorRepository.UpdateProfile(userId,updateData );
            return updatedTutor;       
        } catch (error) {
            throw error        
        }
    }
}