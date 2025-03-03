import { Request, Response, NextFunction } from "express";
import { CreateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { decodedToken } from "../helperFunction/authHelper";
import { IUserService } from "../interfaces/IServiceInterface/IUserService";
import { log } from "console";


export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

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
            res.json({
                status: STATUS_CODES.SUCCESS,
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
                res.json({ status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED, data: user });
            }
        } catch (error) {
            next(error)
        }
    }

    async newUser(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userDetail: CreateUserDto = {
                userName: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            }
            console.log(userDetail);

            const user = await this.userService.newUser(userDetail);
            if (user) {
                res.json({ status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED, data: user });
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
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.DATA_NOTFOUND);
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
            res.json({ status: STATUS_CODES.CREATED, message:MESSAGES.SUCCESS.OTP_SEND })
        } catch (error) {
            next(error)
        }
    }

    async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log(req.body.email,req.body.password);
            const userDetails = await this.userService.getUser(req.body.email, req.body.password);
            if (!userDetails) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const { accessToken, refreshToken, ...userData } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res, 'user', Token);
            res.json({ status:STATUS_CODES.SUCCESS, message:MESSAGES.SUCCESS.LOGIN_SUCCESS,data:userDetails });
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
            const { email, userName, phoneNumber } = req.body
            const userDetails = await this.userService.googleSign(email, userName, phoneNumber);
            if (!userDetails) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const { accessToken, refreshToken, ...user } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res, 'user', Token);
            res.json({ status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED, data: userDetails });
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
                res.json({ status:STATUS_CODES.CREATED,message: MESSAGES.SUCCESS.EMAIL_VERIFIED });
            } else {
                res.json({ status:STATUS_CODES.BAD_REQUEST,message:MESSAGES.ERROR.EMAIL_VERIFICATION_FAILED });
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
            const CookieOtp: string = req.cookies.forgotPassword.response;
            if(otp!==CookieOtp){
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.OTP_DOESNOT_MATCH)
            }
            const email: string = req.cookies.forgotPassword.email;
            const response = await this.userService.verifyOtp(otp, CookieOtp);
            if (!response) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            if (response) {
                res.clearCookie('forgotPassword');
                res.json({ status: STATUS_CODES.SUCCESS, message: MESSAGES.SUCCESS.OTP_VERIFIED, data: email });
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
            res.json({ status:STATUS_CODES.CREATED,message: MESSAGES.SUCCESS.PASSWORD_CHANGED });
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
            const userId: string | null = req.user?._id;
            await this.userService.changePassword(credential, userId);
            res.json({ status:STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.PASSWORD_CHANGED });
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
            const userId: string | null = req.user?._id;
            const { course, total } = await this.userService.myCourses(userId, page, limit, search);
            if (!course) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(201).json({
                data: course,
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
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.LOGOUT_SUCCESS
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
            const userId: string | null = req.user?._id;
            const user = await this.userService.profilePhoto(userId, fileLocation);
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
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
            console.log("lllllllllllllll")
            console.log(req.body,"Nameeeeeee")
            const { userName, phoneNumber } = req.body;
            const userId: string | null = req.user?._id;
            const updatedUser = await this.userService.updateProfile(userId, {
                userName,
                phoneNumber,
            });
            if (!updatedUser) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.PROFILE_UPDATED,
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
            const  quizWinners = await this.userService.quizWinners();
            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data:{courses,winners:quizWinners}
        });
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
            const userId: string | null = req.user?._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            console.log(search)
            const { users, total, currentUser } = await this.userService.leaderBoard(page, limit, search, userId);
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

    async leaderBoardData
    (
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
    try {
        const userId: string | null = req.user?._id;
        const { users,currentUser } = await this.userService.leaderBoardData( userId);
        if (!users) {
            throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
        }
        res.status(201).json({
            users,
            currentUser
        });
    } catch (error) {
        next(error)
    }
}

}