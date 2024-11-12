"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const helperFunction = {
    accesstoken: (userId, role) => {
        return jwt.sign({ _id: userId, role: role }, process.env.ACCESS_SECRET_KEY, { expiresIn: "2m" });
    },
    refreshtoken: (userId, role) => {
        return jwt.sign({ _id: userId, role: role }, process.env.REFRESH_SECRET_KEY, { expiresIn: "1d" });
    },
};
exports.default = helperFunction;
//# sourceMappingURL=authHelper.js.map