"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const institute_repository_1 = require("../repositories/institute.repository");
class AdminService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.instituteRepository = new institute_repository_1.InstituteRepository();
    }
    verifyAdminCredentials(adminEmail, adminPassword) {
        return (adminEmail === "admin@gmail.com" &&
            adminPassword === "admin@123");
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
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map