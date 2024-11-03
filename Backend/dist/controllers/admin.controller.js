"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class AdminController {
    constructor(adminService, userService, instituteService) {
        this.adminService = adminService;
        this.userService = userService;
        this.instituteService = instituteService;
    }
    async verifyAdmin(req, res, next) {
        try {
            const { adminEmail, adminPassword } = req.body;
            const isAdminValid = this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            if (!isAdminValid) {
                throw new error_middleware_1.HttpException(401, "Unauthorized: Invalid admin credentials");
            }
            res.status(200).json({ message: "Admin verified successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            console.log("Request came");
            const users = await this.adminService.getUser(); // Expecting an array of users
            if (!users || users.length === 0) {
                throw new error_middleware_1.HttpException(404, "No users found");
            }
            console.log(users);
            res.status(200).json({ users });
        }
        catch (error) {
            next(error);
        }
    }
    async getInstitutes(req, res, next) {
        try {
            console.log("Request Institute");
            const institutes = await this.adminService.getInstitutes();
            if (!institutes || institutes.length === 0) {
                throw new error_middleware_1.HttpException(404, "No users found");
            }
            console.log(institutes);
            res.status(200).json({ institutes });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map