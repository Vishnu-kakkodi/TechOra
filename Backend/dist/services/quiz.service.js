"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class QuizService {
    constructor(quizRepository, userRepository, tutorRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.tutorRepository = tutorRepository;
    }
    async createQuiz(quizData, tutorId) {
        try {
            if (!tutorId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const tutorData = await this.tutorRepository.findById(tutorId);
            const newItem = {
                ...quizData,
                institutionId: new mongoose_1.default.Types.ObjectId(tutorData === null || tutorData === void 0 ? void 0 : tutorData.institutionId),
                tutorId: new mongoose_1.default.Types.ObjectId(tutorId)
            };
            const createdQuiz = await this.quizRepository.create(newItem);
            return createdQuiz._id;
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async quizList(page, limit, search, department, sort) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.quizRepository.find(query, skip, limit, sortOptions);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async listQuiz(institutionId, page, limit, search, department, sort, selectedStatus) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            if (selectedStatus && selectedStatus.trim() !== '') {
                query.status = { $regex: new RegExp(`^${selectedStatus}$`, 'i') };
            }
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.quizRepository.findQuizz("institutionId", institutionId, query, skip, limit, sortOptions);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async TutorListQuiz(tutorId, page, limit, search, department, sort, selectedStatus) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            if (selectedStatus && selectedStatus.trim() !== '') {
                query.status = { $regex: new RegExp(`^${selectedStatus}$`, 'i') };
            }
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.quizRepository.findQuizz("tutorId", tutorId, query, skip, limit, sortOptions);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async quizDetail(quizId) {
        try {
            if (!quizId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            return await this.quizRepository.findQuiz(quizId);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async updateQuiz(quizData, quizId) {
        try {
            return await this.quizRepository.UpdateQuiz(quizData, quizId);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async findQuiz(instituteId) {
        try {
            if (!instituteId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            return await this.quizRepository.findLatestQuiz(instituteId);
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async quizResult(userId, mark, quizId) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const user = await this.userRepository.findById(userId);
            const quiz = await this.quizRepository.findQuiz(quizId);
            if (quiz) {
                quiz.isComplete.push(userId);
                await quiz.save();
            }
            if (user) {
                let point = Math.abs(Number(mark));
                if (mark.startsWith('+')) {
                    user.quizProgress.score = user.quizProgress.score + point;
                }
                else if (mark.startsWith('-')) {
                    user.quizProgress.score = user.quizProgress.score - point;
                }
                user.quizProgress.progress = mark;
                await user.save();
            }
            await this.userRepository.updateRank();
            return;
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=quiz.service.js.map