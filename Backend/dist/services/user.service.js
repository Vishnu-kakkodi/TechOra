"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(userData) {
        try {
            console.log(userData, "userData");
            return await this.userRepository.create(userData);
        }
        catch (error) {
            throw new error_middleware_1.HttpException(404, 'Email not found');
        }
    }
    async getUser(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new error_middleware_1.HttpException(400, "User does not exist");
            }
            if (user.password !== password) {
                throw new error_middleware_1.HttpException(400, "Password mismatch");
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map