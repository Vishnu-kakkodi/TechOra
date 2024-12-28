"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const cookieUtils_1 = require("../helperFunction/cookieUtils");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const authHelper_1 = require("../helperFunction/authHelper");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async initiateUser(req, res, next) {
        try {
            const userDetail = {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            };
            if (!userDetail) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const user = await this.userService.initiateUser(userDetail);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const userData = {
                user: user,
                otp: user.OTP,
                timeStamp: new Date().getTime()
            };
            res.cookie('userData', userData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000
            });
            res.status(statusCode_1.default.SUCCESS).json({
                success: true,
                message: message_1.default.SUCCESS.OTP_SEND,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyUser(req, res, next) {
        try {
            const { otp } = req.body;
            const CookieData = req.cookies.userData;
            if (!CookieData) {
                throw new error_middleware_1.HttpException(statusCode_1.default.GONE, message_1.default.ERROR.TIME_EXPIRED);
            }
            const user = await this.userService.createUser(CookieData, otp);
            if (user) {
                res.clearCookie('userData');
                res.status(201).json({ user, status: statusCode_1.default.CREATED, message: message_1.default.SUCCESS.USER_CREATED });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        try {
            const email = req.cookies.userData.user.email;
            const user = req.cookies.userData.user;
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
            res.status(201).json({ OTP: "Otp send successfully" });
        }
        catch (error) {
            console.error('Error', error);
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            const userDetails = await this.userService.getUser(req.body.email, req.body.password);
            if (!userDetails) {
                throw new error_middleware_1.HttpException(404, 'User not found');
            }
            const { accessToken, refreshToken, ...userData } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'user', Token);
            res.json({ userDetails });
        }
        catch (error) {
            next(error);
        }
    }
    async googleSign(req, res, next) {
        try {
            const { email, userName, phoneNumber } = req.body;
            const userDetails = await this.userService.googleSign(email, userName, phoneNumber);
            if (!userDetails) {
                throw new error_middleware_1.HttpException(404, 'User not found');
            }
            const { accessToken, refreshToken, ...user } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'user', Token);
            res.status(201).json({ userDetails, status: statusCode_1.default.CREATED, message: message_1.default.SUCCESS.USER_CREATED });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const response = await this.userService.verifyEmail(req.body.email);
            const email = req.body.email;
            const data = {
                response,
                email
            };
            if (response) {
                res.cookie('forgotPassword', data, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 2 * 60 * 1000,
                });
                res.status(201).json({ message: 'Successful' });
            }
            else {
                res.status(400).json({ message: 'Verification failed' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { otp } = req.body;
            const CookieOtp = req.cookies.forgotPassword.response;
            const email = req.cookies.forgotPassword.email;
            const response = await this.userService.verifyOtp(otp, CookieOtp);
            if (!response) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ message: 'Successfull', data: email });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email, password } = req.body;
            await this.userService.forgotPassword(email, password);
            res.status(201).json({ message: message_1.default.SUCCESS.PASSWORD_CHANGED });
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const credential = req.body;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            await this.userService.changePassword(credential, token);
            res.status(statusCode_1.default.SUCCESS).json({ message: message_1.default.SUCCESS.PASSWORD_CHANGED });
        }
        catch (error) {
            next(error);
        }
    }
    async myCourses(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const { course, total } = await this.userService.myCourses(token, page, limit, search);
            if (!course) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(201).json({
                data: course,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            next(error);
        }
    }
    async Logout(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async profilePhoto(req, res, next) {
        try {
            let fileLocation = req.file.location;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const user = await this.userService.profilePhoto(userId, fileLocation);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
    async profileUpdate(req, res, next) {
        try {
            const { userName, phoneNumber } = req.body;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const updatedUser = await this.userService.updateProfile(userId, {
                userName,
                phoneNumber,
            });
            if (!updatedUser) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        }
        catch (error) {
            next(error);
        }
    }
    async homeData(req, res, next) {
        try {
            const courses = await this.userService.homeData();
            if (!courses) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(201).json(courses);
        }
        catch (error) {
            next(error);
        }
    }
    async leaderBoard(req, res, next) {
        try {
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            console.log(search);
            const { users, total, currentUser } = await this.userService.leaderBoard(page, limit, search, userId);
            if (!users) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(201).json({
                users,
                total,
                currentUser
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map