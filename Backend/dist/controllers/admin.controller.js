"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const cookieUtils_1 = require("../helperFunction/cookieUtils");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async verifyAdmin(req, res, next) {
        try {
            const { adminEmail, adminPassword } = req.body;
            const admin = await this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            if (!admin) {
                throw new error_middleware_1.HttpException(401, "Unauthorized: Invalid admin credentials");
            }
            const { accessToken, refreshToken, ...adminMail } = admin;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            (0, cookieUtils_1.setCookie)(res, 'admin', Token);
            res.status(200).json({ admin, message: "Admin verified successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            const filter = req.query.filter;
            console.log(page, limit, search, "Field");
            const { users, total } = await this.adminService.getUser(page, limit, search, filter);
            if (!users) {
                throw new error_middleware_1.HttpException(404, "No users found");
            }
            res.json({
                users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getInstitutes(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            const filter = req.query.filter;
            const { institutes, total } = await this.adminService.getInstitutes(page, limit, search, filter);
            if (!institutes || institutes.length === 0) {
                throw new error_middleware_1.HttpException(404, "No users found");
            }
            console.log(institutes);
            res.json({
                institutes,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            next(error);
        }
    }
    async userAction(req, res, next) {
        try {
            const userId = req.params.userId;
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
            res.status(200).json({
                message: "Institute approved successfully",
                institute: updatedInstitute,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async InstituteReject(req, res, next) {
        try {
            const instituteId = req.query.id;
            const { rejectReason } = req.body;
            const updatedInstitute = await this.adminService.InstituteReject(instituteId, rejectReason);
            res.status(200).json({
                message: "Application rejected",
                institute: updatedInstitute,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async InstituteBlock(req, res, next) {
        try {
            const instituteId = req.query.id;
            const updatedInstitute = await this.adminService.InstituteBlock(instituteId);
            res.status(200).json({
                message: "Institute Blocked",
                institute: updatedInstitute,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async InstituteUnBlock(req, res, next) {
        try {
            const instituteId = req.query.id;
            const updatedInstitute = await this.adminService.InstituteUnBlock(instituteId);
            res.status(200).json({
                message: "Institute Unblocked",
                institute: updatedInstitute,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async downloadDoc(req, res, next) {
        try {
            const url = req.query.url;
            if (!url) {
                res.status(400).json({ error: 'URL is required' });
                return;
            }
            const key = this.getKeyFromUrl(url);
            if (!key) {
                res.status(400).json({ error: 'Invalid URL format' });
                return;
            }
            const data = await this.adminService.downloadDoc(url);
            if (!data.Body) {
                res.status(404).json({ error: 'Document not found' });
                return;
            }
            res.setHeader('Content-Type', data.ContentType || 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key)}"`);
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Pragma', 'no-cache');
            res.send(data.Body);
        }
        catch (error) {
            next(error);
        }
    }
    getKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname.startsWith('/')
                ? urlObj.pathname.slice(1)
                : urlObj.pathname;
            console.log(pathname);
            return pathname;
        }
        catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }
    async InstituteView(req, res, next) {
        try {
            const instituteId = req.query.id;
            const institute = await this.adminService.InstituteView(instituteId);
            res.status(200).json({
                message: "Data fetched successfully",
                data: institute,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async Logout(req, res, next) {
        try {
            res.clearCookie('admin', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map