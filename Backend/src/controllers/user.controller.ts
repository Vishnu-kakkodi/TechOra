import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib//mailer";
import { timeStamp } from "console";
import { UserCookieData } from '../types/user.types';
import { IUserDocument } from "../interfaces/user.interface";
import { generateToken } from "../utils/generateToken";


export class UserController {
    constructor(private readonly userService: UserService) { }

    async initiateUser(
        req: Request<{}, {}, CreateUserDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const user: CreateUserDto = {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            }

            console.log("Request came here")
            const OTP = await this.userService.initiateUser(req.body.email);
            console.log(OTP,"otp")

            const userData = {
                user: user,
                otp: OTP,
                timeStamp: new Date().getTime()
            }
            res.cookie('userData', userData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000
            });

            res.status(201).json({ OTP: "Otp send successfully" })

        } catch (error) {
            console.error('Error', error);
        }
    }

    async verifyUser(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { otp } = req.body;
            console.log(req.cookies);


            const CookieData = req.cookies.userData;

            if (!CookieData) {
                throw new Error('No user data found');
            }

            const userdata: UserCookieData = CookieData;
            console.log(otp)
            console.log(userdata.otp)

            if (otp !== userdata.otp) {
                throw new Error('Invalid OTP');
            } else if (otp === userdata.otp) {
                const user = await this.userService.createUser(userdata.user);
                res.clearCookie('userData');

                res.cookie('userCredential', user, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 10 * 60 * 1000
                });
                res.status(201).json({
                    message: 'User verified and created successfully',
                    user
                });
            }
        } catch (error) {
            console.error('Error', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }


    async resendOtp(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const email = req.cookies.userData.user.email;

            const userdata = req.cookies.userData.user;


            if (!email) {
                throw new Error('No user data found');
            }

            const response = await this.userService.resendOtp(email);

            if (response) {
                const updatedUserData: CreateUserDto = {
                    ...userdata,
                    otp: response,
                    timeStamp: Date.now(),
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


    async createUser(
        req: Request<{}, {}, CreateUserDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log(req.body, "controller")
            console.log("Hai")
            const user = await this.userService.createUser(req.body);
            res.cookie('userData', user, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000, 
              });
            console.log(user)
            res.status(201).json({ user, message: 'Successfull' });
        } catch (error) {
            next(error);
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
            res.cookie('userData', user, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000, 
              });
            res.json({ user });
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

            if (response) {
                res.cookie('forgotPassword', response, {
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
            console.log(otp, "controller")
            console.log("Hai")
            const CookieOtp: string = req.cookies.forgotPassword;
            console.log(CookieOtp);
            const response = await this.userService.verifyOtp(otp, CookieOtp);
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ message: 'Successfull' });
            }
        } catch (error) {
            next(error);
        }
    }


}