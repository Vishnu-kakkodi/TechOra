"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = exports.RepositoryError = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class RepositoryError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.RepositoryError = RepositoryError;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const item = await this.model.create(data);
            return item.toObject();
        }
        catch (error) {
            console.error(error, "Error is occured");
            if (error.name === "ValidationError") {
                throw new RepositoryError("Validation failed for the provided data.", 400, error.errors);
            }
            if (error.code === 11000) {
                throw new error_middleware_1.HttpException(statusCode_1.default.CONFLICT, message_1.default.ERROR.EMAIL_ALREADY_EXISTS);
            }
            throw new RepositoryError("An unexpected error occurred during creation.", 500, error.message);
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map