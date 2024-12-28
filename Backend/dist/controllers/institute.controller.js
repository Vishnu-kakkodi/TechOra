"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const cookieUtils_1 = require("../helperFunction/cookieUtils");
const authHelper_1 = require("../helperFunction/authHelper");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class InstitutionController {
    constructor(instituteService) {
        this.instituteService = instituteService;
    }
    async trackStatus(req, res, next) {
        try {
            const trackID = req.body.trackID;
            if (!trackID) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const response = await this.instituteService.trackStatus(trackID);
            if (!response) {
                res.status(401).json({
                    message: "Application is active"
                });
            }
            res.status(201).json({
                message: "Success",
                data: response
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const response = await this.instituteService.verifyEmail(req.body.email);
            if (response) {
                res.cookie('institutionOTP', response, {
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
            if (!otp) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const CookieData = req.cookies.institutionOTP;
            if (!CookieData) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const response = await this.instituteService.verifyOtp(otp, CookieData[0]);
            if (!response) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const email = CookieData[1];
            if (response) {
                res.clearCookie('institutionOTP');
                res.status(201).json({ email, message: 'Successfull' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async createInstitute(req, res, next) {
        var _a;
        try {
            const fileLocation = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
            if (!fileLocation) {
                res.status(400).json({ message: "File upload failed." });
            }
            const instituteData = {
                ...req.body,
                documentUrl: fileLocation,
            };
            const institute = await this.instituteService.createInstitute(instituteData);
            if (!institute) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'institute', Token);
            res.status(201).json({ instituteDetails, message: 'Successfull' });
        }
        catch (error) {
            next(error);
        }
    }
    async getInstitution(req, res, next) {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail, req.body.collegeCode);
            if (!institute) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const { accessToken, refreshToken, ...instituteDetails } = institute;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'institute', Token);
            res.json({ institute, message: "Login successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async createTutor(req, res, next) {
        try {
            const token = req.cookies.institute.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "institute";
            const institutionId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const tutorDetail = req.body;
            const tutorData = {
                ...tutorDetail,
                institutionId
            };
            await this.instituteService.createTutor(tutorData);
            res.status(201).json({
                status: 'success',
                message: 'Tutor created successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async tutorList(req, res, next) {
        try {
            const token = req.cookies.institute.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "institute";
            const institutionId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const institutes = await this.instituteService.tutorList(institutionId);
            if (!institutes) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(201).json({
                institutes
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createCourse(req, res, next) {
        try {
            const courseData = req.body;
            if (!courseData) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            if (req.file) {
                courseData.thumbnailUrl = req.file.location;
            }
            else {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(201).json({
                status: 'success',
                message: 'Course created successfully',
                data: courseData
            });
        }
        catch (error) {
            next(error);
        }
    }
    async addDepartment(req, res, next) {
        try {
            const token = req.cookies.institute.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "institute";
            const institutionId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const institutes = await this.instituteService.tutorList(institutionId);
            if (!institutes) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const { department } = req.body;
            await this.instituteService.addDepartment(institutionId, department);
            res.status(201).json({ status: 'success', message: "Department added" });
        }
        catch (error) {
            next(error);
        }
    }
    async getDepartment(req, res, next) {
        try {
            const token = req.cookies.institute.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "institute";
            const institutionId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const institutes = await this.instituteService.tutorList(institutionId);
            if (!institutes) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search || '';
            const { departments, total } = await this.instituteService.getDepartment(institutionId, page, limit, search);
            res.status(201).json({ status: 'success', message: "Department added", data: { departments, total } });
        }
        catch (error) {
            next(error);
        }
    }
    async Logout(req, res, next) {
        try {
            res.clearCookie('institute', {
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
}
exports.InstitutionController = InstitutionController;
//# sourceMappingURL=institute.controller.js.map