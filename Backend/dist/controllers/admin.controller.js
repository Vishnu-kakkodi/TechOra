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
            const adminData = await this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            console.log(adminData, "ffffffffffffffffffff");
            if (!adminData) {
                throw new error_middleware_1.HttpException(401, "Unauthorized: Invalid admin credentials");
            }
            res.cookie('adminCredential', adminData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000
            });
            res.status(200).json({ adminData, message: "Admin verified successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            console.log("Request came");
            const users = await this.adminService.getUser();
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
    async userAction(req, res, next) {
        try {
            const userId = req.params.userId;
            console.log("userId:", userId);
            const updatedUser = await this.adminService.userAction(userId);
            res.status(200).json({
                message: "User status updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async InstituteAction(req, res, next) {
        try {
            const instituteId = req.query.id;
            const updatedInstitute = await this.adminService.InstituteAction(instituteId);
            console.log("institute:", instituteId);
            res.status(200).json({
                message: "Institute approved successfully",
                institute: updatedInstitute,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map