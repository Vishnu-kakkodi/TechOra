import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import nodemailer from 'nodemailer';
import { helperFunction } from "../helperFunction/authHelper";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async initiateUser(email: string): Promise<string> {
        try {
            console.log("service side")
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


        } catch (error) {
            throw new HttpException(404, 'Email not found');
        }
    }

    async createUser(userData: CreateUserDto): Promise<IUserDocument> {
        try {
            console.log(userData, "userData")
            const user = await this.userRepository.create(userData);

            console.log(user, "Response");

            const accessToken = helperFunction.accesstoken(user.id, "user");
            const refreshToken = helperFunction.refreshtoken(user.id, "user");

            console.log(accessToken, refreshToken, "AR")


            user.accessToken = accessToken;
            user.refreshToken = refreshToken;

            return user;

        } catch (error) {
            console.log(error)
            throw new HttpException(404, 'Email not found');
        }
    }

    async getUser(email: string, password: string): Promise<IUserDocument | null> {
        try {
            const user = await this.userRepository.findByEmail(email)
            if (!user) {
                throw new HttpException(400, "User does not exist");
            }
            if (user.password !== password) {
                throw new HttpException(400, "Password mismatch");
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

            if (user?.password !== undefined) {
                user.password = password;
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