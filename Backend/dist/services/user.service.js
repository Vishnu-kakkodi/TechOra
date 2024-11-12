"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
const authHelper_1 = __importDefault(require("../helperFunction/authHelper"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async initiateUser(email) {
        try {
            console.log("service side");
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
            throw new error_middleware_1.HttpException(404, 'Email not found');
        }
    }
    async createUser(userData) {
        try {
            console.log(userData, "userData");
            const response = await this.userRepository.create(userData);
            console.log(response, "Response");
            const accessToken = authHelper_1.default.accesstoken(response.id, "user");
            const refreshToken = authHelper_1.default.refreshtoken(response.id, "user");
            console.log(accessToken, refreshToken, "AR");
            return Object.assign({}, response, { accessToken, refreshToken });
        }
        catch (error) {
            throw new error_middleware_1.HttpException(404, 'Email not found');
        }
    }
    async getUser(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new error_middleware_1.HttpException(400, "User does not exist");
            }
            if (user.password !== password) {
                throw new error_middleware_1.HttpException(400, "Password mismatch");
            }
            const accessToken = authHelper_1.default.accesstoken(user.id, "user");
            const refreshToken = authHelper_1.default.refreshtoken(user.id, "user");
            return Object.assign({}, user, { accessToken, refreshToken });
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
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map