"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ReviewService {
    constructor(reviewRepository, courseRepository) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;
    }
    async createReview(rating, comment, userId, courseId) {
        try {
            const userID = new mongoose_1.default.Types.ObjectId(userId);
            const courseID = new mongoose_1.default.Types.ObjectId(courseId);
            let reviewDoc = await this.reviewRepository.findOne(courseID);
            const course = await this.courseRepository.findById(courseId);
            if (reviewDoc) {
                reviewDoc.userReviews.push({
                    userId: userID,
                    comment,
                    rating,
                });
                const totalRatings = reviewDoc.userReviews.reduce((acc, review) => acc + review.rating, 0);
                reviewDoc.averageRating = totalRatings / reviewDoc.userReviews.length;
                if (course) {
                    course.averageRating = totalRatings / reviewDoc.userReviews.length;
                    course.totalReviews = reviewDoc.userReviews.length;
                    await course.save();
                }
                await reviewDoc.save();
            }
            else {
                const reviewData = {
                    courseId: courseID,
                    userReviews: [
                        {
                            userId: userID,
                            comment,
                            rating,
                        },
                    ],
                    averageRating: rating,
                };
                if (course) {
                    course.averageRating = rating;
                    course.totalReviews = 1;
                    await course.save();
                }
                await this.reviewRepository.create(reviewData);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async Review(courseId) {
        try {
            const courseID = new mongoose_1.default.Types.ObjectId(courseId);
            const response = await this.reviewRepository.findOne(courseID);
            const total = response === null || response === void 0 ? void 0 : response.userReviews.length;
            return { response, total };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map