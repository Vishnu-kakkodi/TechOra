import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import nodemailer from 'nodemailer';
import { helperFunction } from "../helperFunction/authHelper";
import STATUS_CODES from '../constants/statusCode';
import MESSAGES from '../constants/message';
import { generateNumericOTP } from "../utils/gererateNumericOTP";
import { emailSend } from "../utils/emailSend";
import bcrypt from 'bcrypt';
import { PasswordUtils } from "../utils/passwordUtils";
import { UserCookieData } from "../types/user.types";

interface userDetail extends CreateUserDto {
    OTP: string;
}


export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async initiateUser(userDetail: CreateUserDto): Promise<userDetail> {
        try {
            const hashPassword = await PasswordUtils.hashPassword(userDetail.password);
            userDetail.password = hashPassword;
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            await emailSend(userDetail.email, OTP);
            return { ...userDetail, OTP }
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR);
        }
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
            const accessToken = helperFunction.accesstoken(user.id, "user");
            const refreshToken = helperFunction.refreshtoken(user.id, "user");
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            return user;


        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR);
        }
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
            throw error;
        }
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
            throw error;
        }
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
            throw error;
        }
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
            throw error;
        }
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
            throw error;
        }
    }
}