"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const authHelper_1 = require("../helperFunction/authHelper");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class CourseController {
    constructor(courseService, quizService) {
        this.createCourse = async (req, res, next) => {
            try {
                const token = req.cookies.tutor.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "tutor";
                const tutorId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const courseData = req.body;
                if (!courseData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                if (req.file) {
                    courseData.thumbnail = req.file.location;
                }
                else {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                if (!courseData.institutionId) {
                    throw new error_middleware_1.HttpException(400, 'Institute ID is required');
                }
                const course = await this.courseService.createCourse(courseData, tutorId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    message: message_1.default.SUCCESS.COURSE_CREATED,
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.draftCourse = async (req, res, next) => {
            try {
                const token = req.cookies.institute.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "institute";
                const institutionId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search;
                const course = await this.courseService.draftCourse({ institutionId }, page, limit, search);
                res.status(201).json({
                    message: "Approved",
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.draftCourses = async (req, res, next) => {
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
                const course = await this.courseService.draftCourse({ tutorId }, page, limit, search);
                res.status(201).json({
                    message: "Approved",
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.createModule = async (req, res, next) => {
            try {
                const courseData = req.body;
                if (!courseData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                if (req.file) {
                    courseData.video = req.file.location;
                }
                else {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                const course = await this.courseService.createModule(courseData.draftId, courseData);
                res.status(201).json({
                    message: "Approved",
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseList = async (req, res, next) => {
            try {
                const token = req.cookies.institute.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "institute";
                const instituteId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search;
                const filter = req.query.filter;
                const sort = req.query.sort;
                const { course, total } = await this.courseService.courseList(instituteId, page, limit, search, filter, sort);
                res.status(201).json({
                    course,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.TutorCourseList = async (req, res, next) => {
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
                const filter = req.query.filter;
                const sort = req.query.sort;
                const { course, total } = await this.courseService.TutorCourseList(tutorId, page, limit, search, filter, sort);
                res.status(201).json({
                    course,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseDetail = async (req, res, next) => {
            var _a;
            try {
                const token = req.cookies.user.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "user";
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const data = await this.courseService.PurchasedCourse(userId);
                const purchased = (_a = (data === null || data === void 0 ? void 0 : data.purchasedCourses)) === null || _a === void 0 ? void 0 : _a.toString();
                const purchasedCourses = purchased === null || purchased === void 0 ? void 0 : purchased.split(",");
                const { courseId } = req.params;
                const course = await this.courseService.courseDetail(courseId);
                const response = {
                    message: "Success",
                    Data: course,
                    purchased: purchasedCourses,
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.courseDetailInstitute = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const course = await this.courseService.courseDetail(courseId);
                const response = {
                    message: "Success",
                    Data: course,
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.userCourseList = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search;
                const filter = req.query.filter;
                const sort = req.query.sort;
                const { course, total, department, totalCourse } = await this.courseService.userCorseList(page, limit, search, filter, sort);
                if (!course) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                res.status(201).json({
                    course,
                    total,
                    department,
                    totalCourse,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseAction = async (req, res, next) => {
            try {
                const courseId = req.body.courseId;
                if (!courseId) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                const information = await this.courseService.courseAction(courseId);
                if (!information) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                res.status(201).json({
                    message: information
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCourse = async (req, res, next) => {
            try {
                const courseData = req.body;
                const courseId = req.query.courseId;
                if (!courseData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                await this.courseService.updateCourse(courseData, courseId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    message: "Course Updated",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.moduleDelete = async (req, res, next) => {
            try {
                const courseId = req.query.courseId;
                const moduleId = req.query.moduleId;
                if (!courseId) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                await this.courseService.moduleDelete(courseId, moduleId);
                res.status(201).json({
                    message: "Module Deleted"
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.chartData = async (req, res, next) => {
            try {
                const token = req.cookies.institute.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "institute";
                const instituteId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { published, draft, listed, unlisted, course } = await this.courseService.chartData(instituteId);
                const quiz = await this.quizService.findQuiz(instituteId);
                res.status(201).json({ published, draft, listed, unlisted, course, quiz });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseService = courseService;
        this.quizService = quizService;
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map