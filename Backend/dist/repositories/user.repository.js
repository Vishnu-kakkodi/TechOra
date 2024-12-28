"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    async findByEmail(email) {
        try {
            return await this.model.findOne({ email });
        }
        catch (error) {
            throw new error_middleware_1.HttpException(400, "Email does not exist");
        }
    }
    async find(searchQuery, skip, limit) {
        try {
            const users = await this.model.find(searchQuery)
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(searchQuery);
            console.log(users);
            return { users, total };
        }
        catch (error) {
            throw error;
        }
    }
    async findById(userId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(userId);
            const user = await this.model.findById({ _id: id });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async findByIdAndUpdate(userId, courseIds) {
        try {
            const mongoUserId = new mongoose_1.default.Types.ObjectId(userId);
            const updatedUser = await this.model.findByIdAndUpdate(userId, {
                $addToSet: {
                    purchasedCourses: {
                        $each: courseIds
                    }
                }
            }, {
                new: true,
                runValidators: true
            }).populate('purchasedCourses');
        }
        catch (error) {
            throw error;
        }
    }
    async UpdateProfile(userId, updatedData) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(userId);
            const updateFields = Object.fromEntries(Object.entries(updatedData).filter(([_, value]) => value !== undefined));
            if (Object.keys(updateFields).length === 0) {
                throw new Error('No valid fields to update');
            }
            const updatedUser = await this.model.findByIdAndUpdate(id, { $set: updateFields }, {
                new: true,
                runValidators: true
            });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new Error('Invalid data provided for update');
            }
            throw error;
        }
    }
    async findUsers(searchQuery, skip, limit) {
        try {
            const users = await this.model.find(searchQuery)
                .sort({ 'quizProgress.rank': 1 })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(searchQuery);
            console.log(users);
            return { users, total };
        }
        catch (error) {
            throw error;
        }
    }
    async updateRank() {
        try {
            const users = await this.model.find()
                .sort({ 'quizProgress.score': -1 })
                .select('_id userName quizProgress');
            const rankedUsers = users.map((user, index) => {
                let rank = (index + 1).toString();
                return {
                    userId: user._id,
                    rank: rank
                };
            });
            const bulkWrite = rankedUsers.map(userRank => ({
                updateOne: {
                    filter: { _id: userRank.userId },
                    update: {
                        $set: {
                            "quizProgress.rank": userRank.rank
                        }
                    }
                }
            }));
            if (bulkWrite.length > 0) {
                await this.model.bulkWrite(bulkWrite);
            }
            return;
        }
        catch (error) {
            throw error;
        }
    }
    async aggregate(pipeline) {
        return this.model.aggregate(pipeline).exec();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map