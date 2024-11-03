"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateToken_1 = require("../utils/generateToken");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async initiateUser(req, res, next) {
        try {
            console.log("hai");
            console.log(req.body);
            const generateNumericOTP = (length) => {
                let otp = '';
                for (let i = 0; i < length; i++) {
                    otp += Math.floor(Math.random() * 10);
                }
                return otp;
            };
            const OTP = generateNumericOTP(4);
            console.log(OTP);
            const user = {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            };
            const userData = {
                user: user,
                otp: OTP,
                timeStamp: new Date().getTime()
            };
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
            await main(req.body.email);
            res.cookie('userData', userData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000
            });
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
            res.status(201).json({ OTP: "Otp send successfully" });
        }
        catch (error) {
            console.error('Error', error);
        }
    }
    async verifyUser(req, res, next) {
        try {
            const { otp } = req.body;
            console.log(req.cookies);
            const CookieData = req.cookies.userData;
            if (!CookieData) {
                throw new Error('No user data found');
            }
            const userdata = CookieData;
            console.log(typeof (otp));
            console.log(typeof (userdata.otp));
            if (otp !== userdata.otp) {
                throw new Error('Invalid OTP');
            }
            else if (otp === userdata.otp) {
                const user = await this.userService.createUser(userdata.user);
                res.clearCookie('userData');
                await (0, generateToken_1.generateToken)(res, user.id);
                res.status(201).json({
                    message: 'User verified and created successfully',
                    user
                });
            }
        }
        catch (error) {
            console.error('Error', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }
    async createUser(req, res, next) {
        try {
            console.log(req.body, "controller");
            console.log("Hai");
            const user = await this.userService.createUser(req.body);
            (0, generateToken_1.generateToken)(res, user.id);
            console.log("Token generated");
            console.log(user);
            res.status(201).json({ user, message: 'Successfull' });
        }
        catch (error) {
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            const user = await this.userService.getUser(req.body.email, req.body.password);
            if (!user) {
                throw new error_middleware_1.HttpException(404, 'User not found');
            }
            await (0, generateToken_1.generateToken)(res, user.id);
            res.json({ user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map