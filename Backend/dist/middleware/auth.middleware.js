"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHelper_1 = require("../helperFunction/authHelper");
const user_model_1 = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    try {
        let role = req.headers.role;
        const getCookieByRole = (role) => {
            switch (role) {
                case "user":
                    return req.cookies.user;
                case "admin":
                    return req.cookies.admin;
                case "institute":
                    return req.cookies.institute;
                case "tutor":
                    return req.cookies.tutor;
                default:
                    return null;
            }
        };
        const tokenToValidate = getCookieByRole(role);
        if (!tokenToValidate) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided",
                code: "TOKEN_MISSING"
            });
        }
        const { accessToken, refreshToken } = tokenToValidate;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "No access token provided",
                code: "ACCESS_TOKEN_MISSING"
            });
        }
        const secretKey = process.env.ACCESS_SECRET_KEY;
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, secretKey);
            if (role === "user") {
                const user = await user_model_1.UserModel.findById(decoded._id);
                if (!user || user.status !== "active") {
                    return res.status(403).json({
                        success: false,
                        message: "User account is not active"
                    });
                }
            }
            if (!decoded._id) {
                return res.status(401).json({
                    success: false,
                    message: "Access token expired",
                    code: "ACCESS_TOKEN_EXPIRED"
                });
            }
            req.user = decoded;
            next();
        }
        catch (tokenError) {
            if (tokenError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                console.log("Access token expired, attempting refresh");
                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Access token expired and no refresh token provided",
                        code: "REFRESH_TOKEN_MISSING"
                    });
                }
                try {
                    const refreshDecoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                    const { _id, role: decodedRole } = refreshDecoded;
                    const newAccessToken = authHelper_1.helperFunction.accesstoken(_id, decodedRole);
                    res.cookie('cookieName', {
                        accessToken: newAccessToken,
                        refreshToken: refreshToken
                    }, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    });
                    if (role === "user") {
                        const user = await user_model_1.UserModel.findById(_id);
                        if (!user || user.status !== "active") {
                            return res.status(403).json({
                                success: false,
                                message: "User account is not active"
                            });
                        }
                    }
                    req.user = { _id, role: decodedRole };
                    next();
                }
                catch (refreshError) {
                    console.log("Refresh token verification failed:", refreshError);
                    return res.status(401).json({
                        success: false,
                        message: "Invalid refresh token",
                        code: "TOKEN_EXPIRED"
                    });
                }
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token",
                    code: "TOKEN_INVALID"
                });
            }
        }
    }
    catch (error) {
        console.error("Authentication middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map