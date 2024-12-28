"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class ReviewController {
    constructor(reviewService) {
        this.createReview = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "user";
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { courseId, currentValue, reviewText } = req.body;
                const response = await this.reviewService.createReview(currentValue, reviewText, userId, courseId);
                res.status(201).json({
                    message: response,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.Review = async (req, res, next) => {
            try {
                const courseId = req.query.courseId;
                const { response, total } = await this.reviewService.Review(courseId);
                res.status(201).json({
                    message: "Review fetched",
                    data: { response, total }
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.reviewService = reviewService;
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map