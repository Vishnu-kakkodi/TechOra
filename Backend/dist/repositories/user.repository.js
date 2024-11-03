"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
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
    async find() {
        try {
            return await this.model.find();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map