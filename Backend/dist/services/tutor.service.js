"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = void 0;
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const mongoose_1 = __importDefault(require("mongoose"));
class TutorService {
    constructor(tutorRepository, userRepository) {
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
    }
    async tutorLogin(tutorEmail, password) {
        try {
            if (!tutorEmail) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const tutor = await this.tutorRepository.findOne(tutorEmail);
            if (!tutor) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            if (tutor.password !== password) {
                throw new error_middleware_1.HttpException(400, "Password mismatch");
            }
            const accessToken = authHelper_1.helperFunction.accesstoken(tutor.id, "tutor");
            const refreshToken = authHelper_1.helperFunction.refreshtoken(tutor.id, "tutor");
            return { ...tutor.toObject(), accessToken, refreshToken };
        }
        catch (error) {
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async uploadPhoto(tutorId, fileLocation) {
        try {
            const tutor = await this.tutorRepository.findById(tutorId);
            if (tutor) {
                tutor.profilePic = fileLocation;
                tutor.save();
            }
            return { ...tutor === null || tutor === void 0 ? void 0 : tutor.toObject() };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const updatedTutor = await this.tutorRepository.UpdateProfile(userId, updateData);
            return updatedTutor;
        }
        catch (error) {
            throw error;
        }
    }
    async enrolledStudents(tutorId, page, limit, search) {
        var _a, _b, _c;
        try {
            const skip = (page - 1) * limit;
            const pipeline = [
                {
                    $lookup: {
                        from: "courses",
                        localField: "purchasedCourses",
                        foreignField: "_id",
                        as: "purchasedCoursesDetails",
                    },
                },
                {
                    $match: {
                        "purchasedCoursesDetails.tutorId": new mongoose_1.default.Types.ObjectId(tutorId),
                    },
                }
            ];
            if (search && search.trim() !== "") {
                pipeline.push({
                    $match: {
                        $or: [
                            { userName: { $regex: search, $options: "i" } },
                            { email: { $regex: search, $options: "i" } },
                            { phoneNumber: { $regex: search, $options: "i" } },
                        ]
                    }
                });
            }
            pipeline.push({
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                userName: 1,
                                email: 1,
                                phoneNumber: 1,
                                profilePhoto: 1,
                            }
                        }
                    ],
                    totalCount: [{ $count: "count" }],
                },
            });
            const result = await this.userRepository.aggregate(pipeline);
            const total = ((_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
            return {
                users: ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.data) || [],
                total
            };
        }
        catch (error) {
            console.error('Error in enrolledStudents:', error);
            throw error;
        }
    }
}
exports.TutorService = TutorService;
//# sourceMappingURL=tutor.service.js.map