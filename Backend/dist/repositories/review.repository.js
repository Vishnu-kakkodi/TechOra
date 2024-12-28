"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const base_repository_1 = require("./base.repository");
const review_model_1 = require("../models/review.model");
class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(review_model_1.ReviewModel);
    }
    async findOne(courseID) {
        try {
            return await this.model.findOne({ courseId: courseID }).populate('userReviews.userId');
        }
        catch (error) {
            throw error;
        }
    }
    async CountDocuments() {
        try {
            return await this.model.countDocuments();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map