"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteService = void 0;
const institute_interface_1 = require("../interfaces/institute.interface");
const institute_repository_1 = require("../repositories/institute.repository");
const nodemailer_1 = __importDefault(require("nodemailer"));
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const generateApplicationID_1 = __importDefault(require("../utils/generateApplicationID"));
const tutor_repository_1 = require("../repositories/tutor.repository");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class InstituteService {
    constructor() {
        this.instituteRepository = new institute_repository_1.InstituteRepository();
        this.tutorRepository = new tutor_repository_1.TutorRepository();
    }
    async trackStatus(trackID) {
        try {
            return await this.instituteRepository.findOne(trackID);
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
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
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
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
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async createInstitute(instituteData) {
        try {
            const applicationId = generateApplicationID_1.default.generateID();
            const institutedata = {
                ...instituteData,
                applicationId
            };
            const institute = await this.instituteRepository.create(institutedata);
            const accessToken = authHelper_1.helperFunction.accesstoken(institute.id, "institute");
            const refreshToken = authHelper_1.helperFunction.refreshtoken(institute.id, "institute");
            return {
                ...institute,
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async getUgetInstitution(instituteEmail, collegeCode) {
        try {
            if (!instituteEmail) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const institute = await this.instituteRepository.findByEmail(instituteEmail);
            if (!institute) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            if (institute.collegeCode !== collegeCode) {
                throw new error_middleware_1.HttpException(400, "Password mismatch");
            }
            if (institute.status !== institute_interface_1.InstituteStatus.Active) {
                throw new error_middleware_1.HttpException(400, "Institution does not exist");
            }
            const accessToken = authHelper_1.helperFunction.accesstoken(institute.id, "institute");
            const refreshToken = authHelper_1.helperFunction.refreshtoken(institute.id, "institute");
            return { ...institute.toObject(), accessToken, refreshToken };
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async createTutor(tutorData) {
        try {
            if (!tutorData) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            await this.tutorRepository.create(tutorData);
            return;
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async tutorList(institutionId) {
        try {
            if (!institutionId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const response = await this.tutorRepository.findTutors(institutionId);
            if (!response) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return response;
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async addDepartment(institutionId, department) {
        try {
            if (!institutionId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const institute = await this.instituteRepository.findById(institutionId);
            if (institute) {
                institute.department.push(department);
                institute.save();
            }
            return;
        }
        catch (error) {
            throw error;
        }
    }
    async getDepartment(institutionId, page, limit, search) {
        try {
            if (!institutionId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const skip = (page - 1) * limit;
            let searchQuery = {};
            if (search && search.trim() !== '') {
                searchQuery.department = { $regex: search, $options: 'i' };
            }
            const { departments, total } = await this.tutorRepository.countTutorsByDepartment('institutionId', institutionId, searchQuery, skip, limit, { department: 1 });
            return {
                departments,
                total
            };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.InstituteService = InstituteService;
//# sourceMappingURL=institute.service.js.map