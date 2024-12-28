"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedToken = exports.helperFunction = void 0;
const jwt = require("jsonwebtoken");
const helperFunction = {
    accesstoken: (userId, role) => {
        return jwt.sign({ _id: userId, role: role }, process.env.ACCESS_SECRET_KEY, { expiresIn: "60m" });
    },
    refreshtoken: (userId, role) => {
        return jwt.sign({ _id: userId, role: role }, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });
    },
};
exports.helperFunction = helperFunction;
const decodedToken = (token, requiredRole) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        if (decoded.role !== requiredRole) {
            console.error(`Invalid role. Expected ${requiredRole}, found ${decoded.role}`);
            return "null";
        }
        return decoded._id;
    }
    catch (error) {
        console.error("Token decoding failed:", error);
        return "null";
    }
};
exports.decodedToken = decodedToken;
//# sourceMappingURL=authHelper.js.map