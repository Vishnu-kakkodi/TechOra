"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookie = exports.setCookie = void 0;
const setCookie = (res, role, token) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    res.cookie(role, token, { ...defaultOptions });
};
exports.setCookie = setCookie;
const clearCookie = (res, name) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};
exports.clearCookie = clearCookie;
//# sourceMappingURL=cookieUtils.js.map