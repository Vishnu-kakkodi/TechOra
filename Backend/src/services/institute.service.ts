import { InstituteDocument } from "../interfaces/institute.interface";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto } from "../dtos/institute.dtos";
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib//mailer";

export class InstituteService {
    constructor(private readonly instituteRepository: InstituteRepository){}

    async verifyEmail(email: string ): Promise<string>{
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

            return OTP
            
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

    async createUser(instituteData: CreateUserDto): Promise<InstituteDocument>{
        try{
            console.log(instituteData,"instituteData")
            return await this.instituteRepository.create(instituteData);
        }catch(error){
            throw error
        }
    }

    async getUgetInstitution(instituteEmail: string): Promise<InstituteDocument | null>{
        try{
            return await this.instituteRepository.findByEmail(instituteEmail)
        }catch(error){
            throw error;
        }
    }
}