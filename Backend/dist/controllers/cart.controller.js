"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class CartController {
    constructor(courseService) {
        this.addToCart = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "user";
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { courseId } = req.body;
                const response = await this.courseService.addToCart(userId, courseId);
                res.status(201).json({
                    message: response,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCartItems = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                const requiredRole = "user";
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const items = await this.courseService.getCartItems(userId);
                if (!items) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                res.status(201).json({
                    message: "Cart item fetched successfully",
                    Data: items
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.removeCart = async (req, res, next) => {
            try {
                const Token = req.cookies.user;
                const token = Token.accessToken;
                if (!token) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
                }
                const requiredRole = "user";
                const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
                const { courseId } = req.body;
                await this.courseService.removeCart(userId, courseId);
                res.status(201).json({
                    message: "Cart item removed successfully",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseService = courseService;
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map