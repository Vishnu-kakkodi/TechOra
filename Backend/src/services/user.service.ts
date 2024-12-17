import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import nodemailer from 'nodemailer';
import { decodedToken, helperFunction } from "../helperFunction/authHelper";
import STATUS_CODES from '../constants/statusCode';
import MESSAGES from '../constants/message';
import { generateNumericOTP } from "../utils/gererateNumericOTP";
import { emailSend } from "../utils/emailSend";
import bcrypt from 'bcrypt';
import { PasswordUtils } from "../utils/passwordUtils";
import { MyCourses, UpdatePassword, UserCookieData } from "../types/user.types";
import { CourseRepository } from "../repositories/course.repository";
import { CourseDocument } from "../interfaces/course.interface";

interface userDetail extends CreateUserDto {
    OTP: string;
}


export class UserService {
    constructor(private readonly userRepository: UserRepository,
        private readonly courseRepository: CourseRepository
        ) { }

    async initiateUser(userDetail: CreateUserDto): Promise<userDetail> {
        try {
            const hashPassword = await PasswordUtils.hashPassword(userDetail.password);
            userDetail.password = hashPassword;
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            const subject:string = "Authentication OTP"
            await emailSend(userDetail.email, subject, OTP);
            return { ...userDetail, OTP }
        } catch (error) {
            throw error        }
    }

    async createUser(cookieData: UserCookieData, OTP: string): Promise<IUserDocument> {
        try {
            const userDetail = cookieData.user
            const CookieOTP = cookieData.otp

            const currentTime = new Date().getTime();
            const timeDifference = (currentTime - cookieData.timestamp) / 1000 / 60;
            if (timeDifference > 10) {
                throw new HttpException(STATUS_CODES.GONE,MESSAGES.ERROR.OTP_EXPIRED );
            }
            if(OTP!==CookieOTP){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.INVALID_OTP);
            }

            const user = await this.userRepository.create(userDetail);
            // const accessToken = helperFunction.accesstoken(user.id, "user");
            // const refreshToken = helperFunction.refreshtoken(user.id, "user");
            // user.accessToken = accessToken;
            // user.refreshToken = refreshToken;
            return user;


        } catch (error) {
            throw error        }
    }

    async getUser(email: string, password: string): Promise<IUserDocument | null> {
        try {
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }

            if (user) {
                if (user.status === 'inactive') {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.ACCOUNT_LOCKED);
                }
                const validPassword = await PasswordUtils.comparePassword(password, user.password);
                if (!validPassword) {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.INVALID_CREDENTIALS);
                }
            }

            const accessToken = helperFunction.accesstoken(user.id, "user");
            const refreshToken = helperFunction.refreshtoken(user.id, "user");


            return { ...user.toObject(), accessToken, refreshToken };

        } catch (error) {
            throw error        }
    }

    async googleSign(email: string, userName: string, phoneNumber: string): Promise<any | null> {
        try {
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                let userDetail = {
                    email,
                    userName,
                    password: userName+"@123",
                    phoneNumber,
                }
                const user = await this.userRepository.create(userDetail);
                console.log(user,"Userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                let id : any = user._id
                const accessToken = helperFunction.accesstoken(id, "user");
                const refreshToken = helperFunction.refreshtoken(id, "user");
    
                return { ...user, accessToken, refreshToken };  

             }

            if (user) {
                if (user.status === 'inactive') {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.ACCOUNT_LOCKED);
                }
            }

            const accessToken = helperFunction.accesstoken(user.id, "user");
            const refreshToken = helperFunction.refreshtoken(user.id, "user");

            return { ...user.toObject(), accessToken, refreshToken };

        } catch (error) {
            throw error        }
    }

    async verifyEmail(email: string): Promise<string> {
        try {
            const user = await this.userRepository.findByEmail(email)
            if (!user) {
                throw new HttpException(400, "User does not exist");
            }
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

            await main(user.email);

            return OTP;

        } catch (error) {
            throw error        }
    }


    async verifyOtp(otp: string, CookieData: string) {
        try {
            console.log(otp, CookieData)
            if (otp !== CookieData) {
                throw new Error('Invalid OTP');
            } else if (otp === CookieData) {
                return "Otp Verified"
            }
        } catch (error) {
            throw error        }
    }


    async forgotPassword(email: string, password: string): Promise<any> {
        try {
            const user: IUserDocument | null = await this.userRepository.findByEmail(email)
            const hashPassword = await PasswordUtils.hashPassword(password);
            if (user?.password !== undefined) {
                user.password = hashPassword;
            }
            await user?.save();
            return user
        } catch (error) {
            throw error        }
    }


    async resendOtp(email: string): Promise<string> {
        try {

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

            return OTP;

        } catch (error) {
            throw error        }
    }

    async changePassword(credential:UpdatePassword, token:string): Promise<any>{
        try{
            const currentPassword = credential.currentPassword;
            const newPassword = credential.newPassword;
            const confirmPassword = credential.confirmPassword;
            const requiredRole = "user";
            const userId = decodedToken(token, requiredRole);
            const user = await this.userRepository.findById(userId);
            if(!user){
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if(user){
                const validPassword = await PasswordUtils.comparePassword(currentPassword, user.password);
                if(!validPassword){
                    console.log("Error")
                    throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.INVALID_CURRENT_PASSWORD)
                }
                if(currentPassword===confirmPassword){
                    throw new HttpException(STATUS_CODES.BAD_REQUEST,MESSAGES.ERROR.SAME_PASSWORD)
                }
                const hashPassword = await PasswordUtils.hashPassword(confirmPassword);

                user.password = hashPassword;

                await user.save();

                return


            }
        }catch(error){
            throw error
        }
    }

    async myCourses(token:string,page:number,limit:number,search:string): Promise<{ courses: CourseDocument[] | null; total: number;}> {
        try{
            const skip = (page - 1) * limit;
            let query:any = {};
            const requiredRole = "user";
            const userId = decodedToken(token, requiredRole);
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }
                ];
            }
            const user = await this.userRepository.findById(userId);
            if(!user){
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const MyCourses = user?.purchasedCourses
            return await this.courseRepository.findMyCourse(MyCourses,query,skip,limit)
        }catch(error){
            throw error        }
    }


    async profilePhoto(userId:string, fileLocation:string): Promise<IUserDocument | null> {
        try {
            const user = await this.userRepository.findById(userId)
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }

            if (user) {
                if (user.status === 'inactive') {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.ACCOUNT_LOCKED);
                }
                user.profilePhoto = fileLocation;
                user.save();
            }


            return { ...user.toObject()};

        } catch (error) {
            throw error        }
    }

    async updateProfile(userId: string, updateData: {
        userName?: string;
        phoneNumber?: string;
        address?: string;
    }): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userRepository.UpdateProfile(userId,updateData );
            return updatedUser;        
        } catch (error) {
            throw error        }
    }

        async homeData(): Promise<{course:CourseDocument[] | null}> {
        try {
            const course = await this.courseRepository.homeData();
            return course;         
        } catch (error) {
            throw error 
               }
    }


    async leaderBoard(page:number,limit:number,search:string,userId:string): Promise<{ users: IUserDocument[] | null; total: number; currentUser: IUserDocument|null}> {
        try{
            const skip = (page - 1) * limit;
            let query:any = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { userName: { $regex: search, $options: 'i' } },
                    { 'quizProgress.rank': { $regex: search, $options: 'i' } }
                ];
            }
            const {users,total} =  await this.userRepository.findUsers(query,skip,limit);
            const currentUser =  await this.userRepository.findById(userId);

            return {users,total,currentUser}
        }catch(error){
            throw error        }
    }
}