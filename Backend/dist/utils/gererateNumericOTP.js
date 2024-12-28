"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumericOTP = void 0;
const generateNumericOTP = (length) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
exports.generateNumericOTP = generateNumericOTP;
//# sourceMappingURL=gererateNumericOTP.js.map