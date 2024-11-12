"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const user_interface_1 = require("../interfaces/user.interface");
const institute_interface_1 = require("../interfaces/institute.interface");
const user_repository_1 = require("../repositories/user.repository");
const institute_repository_1 = require("../repositories/institute.repository");
const authHelper_1 = __importDefault(require("../helperFunction/authHelper"));
const error_middleware_1 = require("../middleware/error.middleware");
class AdminService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.instituteRepository = new institute_repository_1.InstituteRepository();
    }
    verifyAdminCredentials(adminEmail, adminPassword) {
        let admin = null;
        if (adminEmail === "admin@gmail.com" && adminPassword === "admin@123") {
            const accessToken = authHelper_1.default.accesstoken("admin#@$123", "institute");
            const refreshToken = authHelper_1.default.refreshtoken("admin#@$123", "institute");
            admin = {
                email: adminEmail,
                accessToken,
                refreshToken,
            };
        }
        if (!admin) {
            throw new error_middleware_1.HttpException(400, "User does not exist");
        }
        return Promise.resolve(admin);
    }
    async getUser() {
        console.log("Hai request");
        try {
            return await this.userRepository.find();
        }
        catch (error) {
            throw error;
        }
    }
    async getInstitutes() {
        console.log("Hai request");
        try {
            return await this.instituteRepository.find();
        }
        catch (error) {
            throw error;
        }
    }
    async userAction(userId) {
        try {
            console.log(userId, "User ID");
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(400, "User not found");
            }
            user.status = user.status === user_interface_1.UserStatus.Active ? user_interface_1.UserStatus.Inactive : user_interface_1.UserStatus.Active;
            await user.save();
            console.log(user, "Updated User");
            return user;
        }
        catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    }
    async InstituteAction(instituteId) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            institute.status = institute_interface_1.InstituteStatus.Active;
            await institute.save();
            console.log(institute, "Updated User");
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map