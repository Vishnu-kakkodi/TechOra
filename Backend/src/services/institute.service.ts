import { Institute, InstituteDocument, InstituteResponse, InstituteStatus } from "../interfaces/institute.interface";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateTutorDto, CreateUserDto } from "../dtos/institute.dtos";
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib//mailer";
import helperFunction from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import generator from "../utils/generateApplicationID";
import { application } from "express";
import { Tutor } from "../interfaces/tutor.interface";
import { TutorRepository } from "../repositories/tutor.repository";

export class InstituteService {
    private instituteRepository: InstituteRepository;
    private tutorRepository: TutorRepository
    constructor(){
        this.instituteRepository = new InstituteRepository();
        this.tutorRepository = new TutorRepository();
    }

    async verifyEmail(email: string ): Promise<string[]>{
        try{

            const generateNumericOTP = (length: number): string => {
                let otp = '';
                for (let i = 0; i < length; i++) {
                    otp += Math.floor(Math.random() * 10);
                }
                return otp;
            };

            const OTP = generateNumericOTP(4);
            console.log(OTP);

            async function main(email: string) {

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "techoraworld@gmail.com",
                        pass: "ygop jwhp xkwg dbuc",
                    },
                    logger: true
                });


                const info = await transporter.sendMail({
                    from: 'techoraworld@gmail.com',
                    to: email,
                    subject: "Otp For Authentication",
                    text: `This is your otp ${OTP} for authentication`,
                    html: `<p>Your OTP for authentication is: <strong>${OTP}</strong></p>`,
                    headers: { 'x-myheader': 'test header' }
                });

                console.log("Message sent: %s", info.response);
            }

            await main(email);

            return [OTP,email]
            
        }catch(error){
            throw error
        }
    }

    async verifyOtp(otp: string, CookieData: string){
        try{
            if (otp !== CookieData) {
                throw new Error('Invalid OTP');
            } else if (otp === CookieData) {
                return "Otp Verified"
            }
        }catch(error){
            throw error;
        }
    }

    async createInstitute(instituteData: CreateUserDto): Promise<Institute>{
        try{
            console.log(instituteData,"instituteData");
            
            const applicationId = generator.generateID()
            const institutedata = {
                ...instituteData,
                applicationId
            }
            console.log(institutedata,"data")
            const response =  await this.instituteRepository.create(institutedata);
            console.log("response",response)

            // const accessToken = helperFunction.accesstoken(response.id,"institute");
            // const refreshToken = helperFunction.refreshtoken(response.id, "institute");

            // const institute = {
            //     id: response.id,
            //     collegeName: response.collegeName,
            //     instituteEmail: response.instituteEmail,
            //     accessToken,
            //     refreshToken
            //   };

            return response;
        }catch(error){
            throw error
        }
    }

    async getUgetInstitution(instituteEmail: string, collegeCode: string): Promise<InstituteDocument | null>{
        try{
            const institute =  await this.instituteRepository.findByEmail(instituteEmail)
            console.log("kjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",institute)
            if(!institute){
                throw new HttpException(400, "User does not exist");
            }
            if(institute.collegeCode!==collegeCode){
                throw new HttpException(400, "Password mismatch");
            }
            if (institute.status !== InstituteStatus.Active) {
                throw new HttpException(400, "Institution does not exist");
              }
              
            const accessToken = helperFunction.accesstoken(institute.id,"institute");
            const refreshToken = helperFunction.refreshtoken(institute.id, "institute");

            institute.accessToken = accessToken
            institute.refreshToken = refreshToken

            return institute
        }catch(error){
            throw error;
        }
    }

    async createTutor(tutorData: CreateTutorDto): Promise<void>{
        const response =  await this.tutorRepository.create(tutorData);
    }
}