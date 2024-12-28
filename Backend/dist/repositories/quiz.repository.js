"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepository = void 0;
const base_repository_1 = require("./base.repository");
const qiiz_model_1 = require("../models/qiiz.model");
const mongoose_1 = __importDefault(require("mongoose"));
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
class QuizRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(qiiz_model_1.QuizModel);
    }
    async find(searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const quiz = await this.model.find({ status: 'published', ...searchQuery })
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('institutionId');
            const total = await this.model.countDocuments({ status: 'published' }, searchQuery);
            const department = await this.model.distinct("department");
            return { quiz, total, department };
        }
        catch (error) {
            throw error;
        }
    }
    async findQuizzes() {
        try {
            return await this.model.find()
                .populate('institutionId');
        }
        catch (error) {
            throw error;
        }
    }
    async findQuizz(filterKey, filterValue, searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const needsObjectId = ['tutorId', '_id', 'institutionId'].includes(filterKey);
            const filterQuery = needsObjectId
                ? new mongoose_1.default.Types.ObjectId(filterValue)
                : filterValue;
            const baseFilter = {
                [filterKey]: filterQuery,
                status: 'published'
            };
            const filter = {
                ...baseFilter,
                ...(searchQuery || {})
            };
            const quiz = await this.model.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate({
                path: 'institutionId'
            });
            const total = await this.model.countDocuments(filter);
            const department = await this.model.distinct("department");
            return { quiz, total, department };
        }
        catch (error) {
            console.error('Error in findQuizzes:', error);
            throw error;
        }
    }
    async findQuiz(quizId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(quizId);
            return await this.model.findOne(id)
                .populate({
                path: 'institutionId'
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findLatestQuiz(instituteId) {
        try {
            return await this.model.find({ institutionId: instituteId })
                .sort({ createdAt: -1 })
                .limit(4)
                .populate({
                path: 'institutionId'
            });
        }
        catch (error) {
            throw error;
        }
    }
    async UpdateQuiz(quizData, quizId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(quizId);
            const existingQuiz = await this.model.findOne(id)
                .populate({
                path: 'institutionId'
            });
            if (!existingQuiz) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, 'Quiz not found');
            }
            const fieldsToUpdate = [
                'title', 'description', 'department', 'difficultyLevel',
                'passingScore', 'positiveScore', 'negativeScore',
                'stack', 'startDate', 'duration', 'maxAttempts', 'totalQuestions', 'status'
            ];
            fieldsToUpdate.forEach(field => {
                if (quizData[field] !== undefined) {
                    existingQuiz[field] = quizData[field];
                }
            });
            quizData.questions.map((q) => console.log(q._id, "oo"));
            if (quizData.questions && Array.isArray(quizData.questions)) {
                quizData.questions.forEach(updatedQuestion => {
                    if (updatedQuestion._id) {
                        const index = existingQuiz.questions.findIndex(q => q._id.toString() === updatedQuestion._id.toString());
                        if (index !== -1) {
                            existingQuiz.questions[index] = {
                                ...existingQuiz.questions[index],
                                ...updatedQuestion
                            };
                        }
                    }
                    else {
                        existingQuiz.questions.push({
                            ...updatedQuestion,
                            _id: new mongoose_1.default.Types.ObjectId()
                        });
                    }
                });
            }
            await existingQuiz.save();
            return;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.QuizRepository = QuizRepository;
//# sourceMappingURL=quiz.repository.js.map