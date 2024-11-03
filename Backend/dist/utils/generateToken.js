"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '2min'
    });
    console.log("Token generated:", token);
    res.cookie('user_jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 2 * 60 * 1000
    });
};
exports.generateToken = generateToken;
const generateAdminToken = (res, adminId) => {
    const adminToken = jsonwebtoken_1.default.sign({ adminId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '30d'
    });
    res.cookie('admin_jwt', adminToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};
exports.generateAdminToken = generateAdminToken;
//# sourceMappingURL=generateToken.js.map