"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteService = void 0;
const institute_interface_1 = require("../interfaces/institute.interface");
const institute_repository_1 = require("../repositories/institute.repository");
const nodemailer_1 = __importDefault(require("nodemailer"));
const authHelper_1 = __importDefault(require("../helperFunction/authHelper"));
const error_middleware_1 = require("../middleware/error.middleware");
const generateApplicationID_1 = __importDefault(require("../utils/generateApplicationID"));
const tutor_repository_1 = require("../repositories/tutor.repository");
class InstituteService {
    constructor() {
        this.instituteRepository = new institute_repository_1.InstituteRepository();
        this.tutorRepository = new tutor_repository_1.TutorRepository();
    }
    async verifyEmail(email) {
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
            return [OTP, email];
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOtp(otp, CookieData) {
        try {
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
    async createInstitute(instituteData) {
        try {
            console.log(instituteData, "instituteData");
            const applicationId = generateApplicationID_1.default.generateID();
            const institutedata = {
                ...instituteData,
                applicationId
            };
            console.log(institutedata, "data");
            const response = await this.instituteRepository.create(institutedata);
            console.log("response", response);
            // const accessToken = helperFunction.accesstoken(response.id,"institute");
            // const refreshToken = helperFunction.refreshtoken(response.id, "institute");
            // const institute = {
            //     id: response.id,
            //     collegeName: response.collegeName,
            //     instituteEmail: response.instituteEmail,
            //     accessToken,
            //     refreshToken
            //   };
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getUgetInstitution(instituteEmail, collegeCode) {
        try {
            const institute = await this.instituteRepository.findByEmail(instituteEmail);
            console.log("kjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj", institute);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "User does not exist");
            }
            if (institute.collegeCode !== collegeCode) {
                throw new error_middleware_1.HttpException(400, "Password mismatch");
            }
            if (institute.status !== institute_interface_1.InstituteStatus.Active) {
                throw new error_middleware_1.HttpException(400, "Institution does not exist");
            }
            const accessToken = authHelper_1.default.accesstoken(institute.id, "institute");
            const refreshToken = authHelper_1.default.refreshtoken(institute.id, "institute");
            institute.accessToken = accessToken;
            institute.refreshToken = refreshToken;
            return institute;
        }
        catch (error) {
            throw error;
        }
    }
    async createTutor(tutorData) {
        const response = await this.tutorRepository.create(tutorData);
    }
}
exports.InstituteService = InstituteService;
//# sourceMappingURL=institute.service.js.map