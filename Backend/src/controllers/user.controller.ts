import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import { UserCookieData } from '../types/user.types';
import { setCookie } from "../helperFunction/cookieUtils";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


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
            if(!userDetail){
                throw new HttpException(STATUS_CODES.BAD_REQUEST,MESSAGES.ERROR.BAD_REQUEST)
            }
            const user = await this.userService.initiateUser(userDetail);

            if(!user){
                throw new HttpException(STATUS_CODES.BAD_REQUEST,MESSAGES.ERROR.BAD_REQUEST)
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
            res.status(STATUS_CODES.SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.SERVER_ERROR,
              });
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
                throw new HttpException(STATUS_CODES.GONE,MESSAGES.ERROR.TIME_EXPIRED);
            }

            const user = await this.userService.createUser(CookieData,otp);
            if(user){
                res.clearCookie('userData');

                const { accessToken, refreshToken, ...userDetails } = user;
                const Token = {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
                setCookie(res, 'user', Token);
                res.status(201).json({ userDetails, status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED });
            }
        } catch (error) {
            res.status(STATUS_CODES.SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.SERVER_ERROR,
              });
        }
    }


    async resendOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const email = req.cookies.userData.user.email;

            const user:CreateUserDto = req.cookies.userData.user;


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
        }
    }

    async getUser(
        req: Request<{ email: string, password: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = await this.userService.getUser(req.body.email, req.body.password);
            if (!user) {
                throw new HttpException(404, 'User not found');
            }
            const { accessToken, refreshToken, ...userDetails } = user;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res, 'user', Token);
            res.json({ userDetails });
        } catch (error) {
            next(error);
        }
    }


    async verifyEmail(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log(req.body, "controller");
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
            next(error);
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
            console.log("Hai")
            const CookieOtp: string = req.cookies.forgotPassword.response;
            const email: string = req.cookies.forgotPassword.email;
            console.log(CookieOtp);
            const response = await this.userService.verifyOtp(otp, CookieOtp);
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ message: 'Successfull', data: email });
            }
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await this.userService.forgotPassword(email, password);
            res.status(201).json({ message: 'Successfull' });
        } catch (error) {
            next(error);
        }
    }


}