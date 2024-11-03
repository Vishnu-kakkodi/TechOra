"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class InstituteService {
    constructor(instituteRepository) {
        this.instituteRepository = instituteRepository;
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
            return OTP;
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
    async createUser(instituteData) {
        try {
            console.log(instituteData, "instituteData");
            return await this.instituteRepository.create(instituteData);
        }
        catch (error) {
            throw error;
        }
    }
    async getUgetInstitution(instituteEmail) {
        try {
            return await this.instituteRepository.findByEmail(instituteEmail);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.InstituteService = InstituteService;
//# sourceMappingURL=institute.service.js.map