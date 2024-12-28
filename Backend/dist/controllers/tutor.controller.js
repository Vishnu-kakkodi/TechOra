"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const cookieUtils_1 = require("../helperFunction/cookieUtils");
const authHelper_1 = require("../helperFunction/authHelper");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class TutorController {
    constructor(tutorService) {
        this.tutorService = tutorService;
    }
    async tutorLogin(req, res, next) {
        try {
            const tutor = await this.tutorService.tutorLogin(req.body.tutorEmail, req.body.password);
            if (!tutor) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const { accessToken, refreshToken, ...tutorDetails } = tutor;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'tutor', Token);
            res.json({ tutor, message: "Login successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadPhoto(req, res, next) {
        try {
            const token = req.cookies.tutor.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "tutor";
            const tutorId = (0, authHelper_1.decodedToken)(token, requiredRole);
            let fileLocation = req.file.location;
            const tutor = await this.tutorService.uploadPhoto(tutorId, fileLocation);
            res.status(201).json({
                success: true,
                message: "Profile photo updated",
                data: tutor
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const token = req.cookies.tutor.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "tutor";
            const tutorId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const { tutorname, experiance, education } = req.body;
            const updatedTutor = await this.tutorService.updateProfile(tutorId, {
                tutorname,
                experiance,
                education
            });
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedTutor
            });
        }
        catch (error) {
        }
    }
    async enrolledStudents(req, res, next) {
        try {
            const token = req.cookies.tutor.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "tutor";
            const tutorId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            const { users, total } = await this.tutorService.enrolledStudents(tutorId, page, limit, search);
            if (!users) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            res.status(201).json({
                users,
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
            res.clearCookie('tutor', {
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
exports.TutorController = TutorController;
//# sourceMappingURL=tutor.controller.js.map