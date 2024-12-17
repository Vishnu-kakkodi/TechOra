import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import { UserCookieData } from '../types/user.types';
import { setCookie } from "../helperFunction/cookieUtils";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { decodedToken } from "../helperFunction/authHelper";
import { log } from "console";


export class UserController {
    constructor(private readonly userService: UserService) { }

    async initiateUser(
        req: Request<{}, {}, CreateUserDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userDetail: CreateUserDto = {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            }
            if (!userDetail) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
            }
            const user = await this.userService.initiateUser(userDetail);

            if (!user) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
            }

            const userData = {
                user: user,
                otp: user.OTP,
                timeStamp: new Date().getTime()
            }
            res.cookie('userData', userData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000
            });

            res.status(STATUS_CODES.SUCCESS).json({
                success: true,
                message: MESSAGES.SUCCESS.OTP_SEND,
            });

        } catch (error) {
            next(error)
        }
    }

    async verifyUser(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { otp } = req.body;
            const CookieData = req.cookies.userData;
            if (!CookieData) {
                throw new HttpException(STATUS_CODES.GONE, MESSAGES.ERROR.TIME_EXPIRED);
            }

            const user = await this.userService.createUser(CookieData, otp);
            if (user) {
                res.clearCookie('userData');

                // const { accessToken, refreshToken, ...userDetails } = user;
                // const Token = {
                //     accessToken: accessToken,
                //     refreshToken: refreshToken
                // }
                // setCookie(res,'user',Token);
                res.status(201).json({ user, status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED });
            }
        } catch (error) {
            next(error)
        }
    }


    async resendOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const email = req.cookies.userData.user.email;

            const user: CreateUserDto = req.cookies.userData.user;


            if (!email) {
                throw new Error('No user data found');
            }

            const response = await this.userService.resendOtp(email);

            if (response) {
                const updatedUserData = {
                    user: user,
                    otp: response,
                    timeStamp: new Date().getTime()
                };

                res.cookie('userData', updatedUserData, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 5 * 60 * 1000,
                });
            }

            res.status(201).json({ OTP: "Otp send successfully" })

        } catch (error) {
            console.error('Error', error);
            next(error)
        }
    }

    async getUser(
        req: Request<{ email: string, password: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userDetails = await this.userService.getUser(req.body.email, req.body.password);
            if (!userDetails) {
                throw new HttpException(404, 'User not found');
            }
            const { accessToken, refreshToken, ...userData } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res, 'user', Token);
            res.json({ userDetails });
        } catch (error) {
            next(error)
        }
    }

    async googleSign(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {email,userName,phoneNumber} = req.body
            const userDetails = await this.userService.googleSign(email,userName,phoneNumber);
            if (!userDetails) {
                throw new HttpException(404, 'User not found');
            }
            const { accessToken, refreshToken, ...user } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res, 'user', Token);
            res.status(201).json({ userDetails, status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED });
        } catch (error) {
            next(error)
        }
    }


    async verifyEmail(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const response = await this.userService.verifyEmail(req.body.email);
            const email: string = req.body.email
            const data = {
                response,
                email
            }

            if (response) {
                res.cookie('forgotPassword', data, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 2 * 60 * 1000,
                });
                res.status(201).json({ message: 'Successful' });
            } else {
                res.status(400).json({ message: 'Verification failed' });
            }
        } catch (error) {
            next(error)
        }
    }


    async verifyOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { otp } = req.body;
            console.log(otp, "controllerOTP")
            const CookieOtp: string = req.cookies.forgotPassword.response;
            const email: string = req.cookies.forgotPassword.email;
            console.log(CookieOtp);
            const response = await this.userService.verifyOtp(otp, CookieOtp);
            if (!response) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ message: 'Successfull', data: email });
            }
        } catch (error) {
            next(error)
        }
    }

    async forgotPassword(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password } = req.body;
            await this.userService.forgotPassword(email, password);
            res.status(201).json({ message: MESSAGES.SUCCESS.PASSWORD_CHANGED });
        } catch (error) {
            next(error)
        }
    }

    async changePassword(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const credential = req.body;
            const Token = req.cookies.user
            const token = Token.accessToken
            if (!token) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
            }
            await this.userService.changePassword(credential, token);
            res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.SUCCESS.PASSWORD_CHANGED });
        } catch (error) {
            next(error)
        }
    }


    async myCourses(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const Token = req.cookies.user
            const token = Token.accessToken;
            if (!token) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
            }
            const { courses, total } = await this.userService.myCourses(token, page, limit, search);
            if (!courses) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json({
                courses,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error)
        }
    }

    async Logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            res.clearCookie('user', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error)
        }
    }

    async profilePhoto(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            let fileLocation = (req.file as any).location;
            const Token = req.cookies.user
            const token = Token.accessToken;
            if (!token) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
            const user = await this.userService.profilePhoto(userId, fileLocation);
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
                data: user
            });
        } catch (error) {
            next(error)
        }
    }



    async profileUpdate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userName, phoneNumber } = req.body;
            const Token = req.cookies.user
            const token = Token.accessToken;
            if (!token) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "user";
            const userId: string | null = decodedToken(token, requiredRole);
            const updatedUser = await this.userService.updateProfile(userId, {
                userName,
                phoneNumber,
            });
            if (!updatedUser) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        } catch (error) {
            next(error)
        }
    }

    async homeData(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const courses = await this.userService.homeData();
            if (!courses) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json(
                courses
            );
        } catch (error) {
            next(error)
        }
    }

    async leaderBoard
    (
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const Token = req.cookies.user
            const token = Token.accessToken;
            if (!token) {
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
            }
            const requiredRole = "user";
            console.log("lllll",token,"toooooooooooooooooooooo")
            const userId: string | null = decodedToken(token, requiredRole);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            console.log(search)
            const {users,total, currentUser }= await this.userService.leaderBoard(page, limit, search,userId);
            if (!users) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json({
                users,
                total,
                currentUser
            });
        } catch (error) {
            next(error)
        }
    }

}