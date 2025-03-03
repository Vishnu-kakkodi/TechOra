import { IUserDocument } from "../type/user.type";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import nodemailer from 'nodemailer';
import { decodedToken, helperFunction } from "../helperFunction/authHelper";
import STATUS_CODES from '../constants/statusCode';
import MESSAGES from '../constants/message';
import { generateNumericOTP } from "../utils/gererateNumericOTP";
import { emailSend } from "../utils/emailSend";
import { PasswordUtils } from "../utils/passwordUtils";
import { UpdatePassword, UserCookieData } from "../type/types/user.types";
import { CourseRepository } from "../repositories/course.repository";
import { CourseDocument } from "../type/course.type";
import { IUserService } from "../interfaces/IServiceInterface/IUserService";
import { IUserRepository } from "../interfaces/IRepositoryInterface/IUserRepository";
import { ICourseRepository } from "../interfaces/IRepositoryInterface/ICourseRepository";
import { log } from "console";
import { FilterQuery } from "mongoose";

export interface userDetail extends CreateUserDto {
    OTP: string;
}


class UserService implements IUserService {
    private readonly userRepository: IUserRepository;
    private readonly courseRepository: ICourseRepository

    constructor(userRepository: IUserRepository,courseRepository: ICourseRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
     }

    async initiateUser(userDetail: CreateUserDto): Promise<userDetail> {
        try {
            const hashPassword = await PasswordUtils.hashPassword(userDetail.password);
            userDetail.password = hashPassword;
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            const subject: string = "Authentication OTP"
            await emailSend(userDetail.email, subject, OTP);
            return { ...userDetail, OTP }
        } catch (error) {
            throw error
        }
    }

    async createUser(cookieData: UserCookieData, OTP: string): Promise<IUserDocument> {
        try {
            const userDetail = cookieData.user
            const CookieOTP = cookieData.otp

            const currentTime = new Date().getTime();
            const timeDifference = (currentTime - cookieData.timestamp) / 1000 / 60;
            if (timeDifference > 10) {
                throw new HttpException(STATUS_CODES.GONE, MESSAGES.ERROR.OTP_EXPIRED);
            }
            if (OTP !== CookieOTP) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.INVALID_OTP);
            }

            const user = await this.userRepository.create(userDetail);
            return user;


        } catch (error) {
            throw error
        }
    }

    async newUser(userData:CreateUserDto): Promise<IUserDocument> {
        try {
            const hashPassword = await PasswordUtils.hashPassword(userData.password);
            userData.password = hashPassword;
            const user = await this.userRepository.create(userData);
            return user;
        } catch (error) {
            throw error
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
            throw error
        }
    }

    async googleSign(email: string, userName: string, phoneNumber: string): Promise<any | null> {
        try {
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                let userDetail = {
                    email,
                    userName,
                    password: userName + "@123",
                    phoneNumber,
                }
                const user = await this.userRepository.create(userDetail);
                let id: any = user._id
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
            throw error
        }
    }

    async verifyEmail(email: string): Promise<string> {
        try {
            const user = await this.userRepository.findByEmail(email)
            if (!user) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.USER_NOT_FOUND);
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
            throw error
        }
    }


    async verifyOtp(otp: string, CookieData: string): Promise<string | undefined> {
        try {
            console.log(otp, CookieData)
            if (otp !== CookieData) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST,MESSAGES.ERROR.INVALID_OTP);
            } else if (otp === CookieData) {
                return MESSAGES.SUCCESS.OTP_VERIFIED
            }
        } catch (error) {
            throw error
        }
    }


    async forgotPassword(email: string, password: string): Promise<IUserDocument | null> {
        try {
            const user: IUserDocument | null = await this.userRepository.findByEmail(email)
            const hashPassword = await PasswordUtils.hashPassword(password);
            if (user?.password !== undefined) {
                user.password = hashPassword;
            }
            await user?.save();
            return user
        } catch (error) {
            throw error
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
            throw error
        }
    }

    async changePassword(credential: UpdatePassword, userId: string): Promise<void> {
        try {
            const currentPassword = credential.currentPassword;
            const newPassword = credential.newPassword;
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                const validPassword = await PasswordUtils.comparePassword(currentPassword, user.password);
                if (!validPassword) {
                    throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.INVALID_CURRENT_PASSWORD)
                }
                if (currentPassword === newPassword) {
                    throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.SAME_PASSWORD)
                }
                const hashPassword = await PasswordUtils.hashPassword(newPassword);

                user.password = hashPassword;

                await user.save();

                return


            }
        } catch (error) {
            throw error
        }
    }

    async myCourses(userId: string, page: number, limit: number, search: string): Promise<{ course: CourseDocument[] | null; total: number; }> {
        try {
            const skip = (page - 1) * limit;
      let query: FilterQuery<CourseDocument> = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }
                ];
            }
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const MyCourses = user?.purchasedCourses
            return await this.courseRepository.findMyCourse(MyCourses, query, skip, limit)
        } catch (error) {
            throw error
        }
    }


    async profilePhoto(userId: string, fileLocation: string): Promise<IUserDocument | null> {
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


            return { ...user.toObject() };

        } catch (error) {
            throw error
        }
    }

    async updateProfile(userId: string, updateData: {
        userName?: string;
        phoneNumber?: string;
        address?: string;
    }): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userRepository.UpdateProfile(userId, updateData);
            return updatedUser;
        } catch (error) {
            throw error
        }
    }

    async homeData(): Promise<{ course: CourseDocument[] | null }> {
        try {
            const course = await this.courseRepository.homeData();
            return course;
        } catch (error) {
            throw error
        }
    }

    async quizWinners(): Promise<{ quizWinners: IUserDocument[] | null }> {
        try {
            const quizWinners =  await this.userRepository.quizWinners();
            return quizWinners;
        } catch (error) {
            throw error
        }
    }


    async leaderBoard(page: number, limit: number, search: string, userId: string): Promise<{ users: IUserDocument[] | null; total: number; currentUser: IUserDocument | null }> {
        try {
            const skip = (page - 1) * limit;
        let query: FilterQuery<IUserDocument> = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { userName: { $regex: search, $options: 'i' } },
                    { 'quizProgress.rank': { $regex: search, $options: 'i' } }
                ];
            }
            const { users, total } = await this.userRepository.findUsers(query, skip, limit);
            const currentUser = await this.userRepository.findById(userId);

            return { users, total, currentUser }
        } catch (error) {
            throw error
        }
    }


    async leaderBoardData( userId: string): Promise<{ users: IUserDocument[] | null; currentUser: IUserDocument | null }> {
        try {

            const { users } = await this.userRepository.findUser();
            const currentUser = await this.userRepository.findById(userId);

            return { users, currentUser }
        } catch (error) {
            throw error
        }
    }
}

export default UserService;