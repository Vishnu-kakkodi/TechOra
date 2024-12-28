"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
const authHelper_1 = require("../helperFunction/authHelper");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const gererateNumericOTP_1 = require("../utils/gererateNumericOTP");
const emailSend_1 = require("../utils/emailSend");
const passwordUtils_1 = require("../utils/passwordUtils");
class UserService {
    constructor(userRepository, courseRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    async initiateUser(userDetail) {
        try {
            const hashPassword = await passwordUtils_1.PasswordUtils.hashPassword(userDetail.password);
            userDetail.password = hashPassword;
            const OTP = (0, gererateNumericOTP_1.generateNumericOTP)(4);
            console.log(OTP);
            const subject = "Authentication OTP";
            await (0, emailSend_1.emailSend)(userDetail.email, subject, OTP);
            return { ...userDetail, OTP };
        }
        catch (error) {
            throw error;
        }
    }
    async createUser(cookieData, OTP) {
        try {
            const userDetail = cookieData.user;
            const CookieOTP = cookieData.otp;
            const currentTime = new Date().getTime();
            const timeDifference = (currentTime - cookieData.timestamp) / 1000 / 60;
            if (timeDifference > 10) {
                throw new error_middleware_1.HttpException(statusCode_1.default.GONE, message_1.default.ERROR.OTP_EXPIRED);
            }
            if (OTP !== CookieOTP) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.INVALID_OTP);
            }
            const user = await this.userRepository.create(userDetail);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async getUser(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                if (user.status === 'inactive') {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.ACCOUNT_LOCKED);
                }
                const validPassword = await passwordUtils_1.PasswordUtils.comparePassword(password, user.password);
                if (!validPassword) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.INVALID_CREDENTIALS);
                }
            }
            const accessToken = authHelper_1.helperFunction.accesstoken(user.id, "user");
            const refreshToken = authHelper_1.helperFunction.refreshtoken(user.id, "user");
            return { ...user.toObject(), accessToken, refreshToken };
        }
        catch (error) {
            throw error;
        }
    }
    async googleSign(email, userName, phoneNumber) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                let userDetail = {
                    email,
                    userName,
                    password: userName + "@123",
                    phoneNumber,
                };
                const user = await this.userRepository.create(userDetail);
                let id = user._id;
                const accessToken = authHelper_1.helperFunction.accesstoken(id, "user");
                const refreshToken = authHelper_1.helperFunction.refreshtoken(id, "user");
                return { ...user, accessToken, refreshToken };
            }
            if (user) {
                if (user.status === 'inactive') {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.ACCOUNT_LOCKED);
                }
            }
            const accessToken = authHelper_1.helperFunction.accesstoken(user.id, "user");
            const refreshToken = authHelper_1.helperFunction.refreshtoken(user.id, "user");
            return { ...user.toObject(), accessToken, refreshToken };
        }
        catch (error) {
            throw error;
        }
    }
    async verifyEmail(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new error_middleware_1.HttpException(400, "User does not exist");
            }
            const generateNumericOTP = (length) => {
                let otp = '';
                for (let i = 0; i < length; i++) {
                    otp += Math.floor(Math.random() * 10);
                }
                return otp;
            };
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            async function main(email) {
                const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOtp(otp, CookieData) {
        try {
            console.log(otp, CookieData);
            if (otp !== CookieData) {
                throw new Error('Invalid OTP');
            }
            else if (otp === CookieData) {
                return "Otp Verified";
            }
        }
        catch (error) {
            throw error;
        }
    }
    async forgotPassword(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            const hashPassword = await passwordUtils_1.PasswordUtils.hashPassword(password);
            if ((user === null || user === void 0 ? void 0 : user.password) !== undefined) {
                user.password = hashPassword;
            }
            await (user === null || user === void 0 ? void 0 : user.save());
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async resendOtp(email) {
        try {
            const generateNumericOTP = (length) => {
                let otp = '';
                for (let i = 0; i < length; i++) {
                    otp += Math.floor(Math.random() * 10);
                }
                return otp;
            };
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            async function main(email) {
                const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            throw error;
        }
    }
    async changePassword(credential, token) {
        try {
            const currentPassword = credential.currentPassword;
            const newPassword = credential.newPassword;
            const confirmPassword = credential.confirmPassword;
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                const validPassword = await passwordUtils_1.PasswordUtils.comparePassword(currentPassword, user.password);
                if (!validPassword) {
                    console.log("Error");
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.INVALID_CURRENT_PASSWORD);
                }
                if (currentPassword === confirmPassword) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.SAME_PASSWORD);
                }
                const hashPassword = await passwordUtils_1.PasswordUtils.hashPassword(confirmPassword);
                user.password = hashPassword;
                await user.save();
                return;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async myCourses(token, page, limit, search) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }
                ];
            }
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            const MyCourses = user === null || user === void 0 ? void 0 : user.purchasedCourses;
            return await this.courseRepository.findMyCourse(MyCourses, query, skip, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async profilePhoto(userId, fileLocation) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                if (user.status === 'inactive') {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.ACCOUNT_LOCKED);
                }
                user.profilePhoto = fileLocation;
                user.save();
            }
            return { ...user.toObject() };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const updatedUser = await this.userRepository.UpdateProfile(userId, updateData);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async homeData() {
        try {
            const course = await this.courseRepository.homeData();
            return course;
        }
        catch (error) {
            throw error;
        }
    }
    async leaderBoard(page, limit, search, userId) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { userName: { $regex: search, $options: 'i' } },
                    { 'quizProgress.rank': { $regex: search, $options: 'i' } }
                ];
            }
            const { users, total } = await this.userRepository.findUsers(query, skip, limit);
            const currentUser = await this.userRepository.findById(userId);
            return { users, total, currentUser };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map