"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authentication) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token)
        return res.status(403).send("Token is required");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).send("Invalid Token");
    }
};
exports.authMiddleware = authMiddleware;
const authorizeRole = (role) => (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== role) {
        res.status(403).send("Access denied: insufficient permission");
    }
    next();
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=auth.middleware.js.map