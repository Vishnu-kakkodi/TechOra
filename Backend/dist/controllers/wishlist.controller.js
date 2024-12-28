"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class WishlistController {
    constructor(courseService) {
        this.addToWishlist = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = 'user';
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { courseId } = req.body;
                const response = await this.courseService.addToWishlist(userId, courseId);
                res.status(201).json({
                    message: response,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.wishlistPage = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search || '';
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = 'user';
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { favourates, total } = await this.courseService.wishlistPage(userId, page, limit, search);
                res.status(201).json({
                    favourates,
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
        this.removeWishlist = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = 'user';
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const courseId = req.params.courseId;
                const response = await this.courseService.removeWishlist(userId, courseId);
                res.status(201).json({
                    message: response
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseService = courseService;
    }
}
exports.WishlistController = WishlistController;
//# sourceMappingURL=wishlist.controller.js.map