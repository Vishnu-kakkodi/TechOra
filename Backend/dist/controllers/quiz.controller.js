"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const authHelper_1 = require("../helperFunction/authHelper");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const error_middleware_1 = require("../middleware/error.middleware");
class QuizController {
    constructor(quizService) {
        this.createQuiz = async (req, res, next) => {
            try {
                const token = req.cookies.tutor.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "tutor";
                const tutorId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const quizData = req.body;
                if (!quizData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
                }
                const quizId = await this.quizService.createQuiz(quizData, tutorId);
                console.log(quizId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    data: quizId,
                    message: message_1.default.SUCCESS.QUIZ_CREATED,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.quizList = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search;
                const filter = req.query.filter;
                const sort = req.query.sort;
                const { quiz, total, department } = await this.quizService.quizList(page, limit, search, filter, sort);
                if (!quiz) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
                }
                res.status(201).json({
                    quiz,
                    total,
                    department,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listQuiz = async (req, res, next) => {
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
                const filter = req.query.filter;
                const sort = req.query.sort;
                const selectedStatus = req.query.selectedStatus;
                const { quiz, total, department } = await this.quizService.listQuiz(institutionId, page, limit, search, filter, sort, selectedStatus);
                if (!quiz) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
                }
                res.status(201).json({
                    quiz,
                    total,
                    department,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.TutorListQuiz = async (req, res, next) => {
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
                const selectedStatus = req.query.selectedStatus;
                const { quiz, total, department } = await this.quizService.TutorListQuiz(tutorId, page, limit, search, filter, sort, selectedStatus);
                if (!quiz) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
                }
                res.status(201).json({
                    quiz,
                    total,
                    department,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.quizDetail = async (req, res, next) => {
            try {
                const quizId = req.query.quizId;
                const quiz = await this.quizService.quizDetail(quizId);
                res.status(201).json({
                    message: "Quiz Detail fetched succesfully",
                    data: quiz
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateQuiz = async (req, res, next) => {
            try {
                const quizData = req.body;
                if (!quizData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
                }
                const quizId = req.query.quizId;
                await this.quizService.updateQuiz(quizData, quizId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    message: message_1.default.SUCCESS.QUIZ_UPDATED,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.quizResult = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "user";
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const mark = req.body.mark;
                const quizId = req.body.quizId;
                await this.quizService.quizResult(userId, mark, quizId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    message: "Result Added"
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.quizService = quizService;
    }
}
exports.QuizController = QuizController;
//# sourceMappingURL=quiz.controller.js.map