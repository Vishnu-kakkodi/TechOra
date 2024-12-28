"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGES = {
    SUCCESS: {
        USER_CREATED: "User has been successfully created.",
        DATA_RETRIEVED: "Data retrieved successfully.",
        USER_UPDATED: "User details have been successfully updated.",
        USER_DELETED: "User has been successfully deleted.",
        LOGIN_SUCCESS: "Login successful.",
        LOGOUT_SUCCESS: "Logout successful.",
        PASSWORD_CHANGED: "Password has been successfully changed.",
        OTP_SEND: "Otp send successfully.",
        QUIZ_CREATED: "Quiz created.",
        QUIZ_UPDATED: "Quiz updated.",
        QUIZ_FETCHED: "Quiz fetched successfully.",
        COURSE_CREATED: "Course created successfully."
    },
    ERROR: {
        USER_NOT_FOUND: "User not found.",
        TIME_EXPIRED: "Time expired, Try again.",
        EMAIL_ALREADY_EXISTS: "Email already exists.",
        INVALID_CREDENTIALS: "Invalid email or password.",
        INVALID_CURRENT_PASSWORD: "Incorrect current password.",
        SAME_PASSWORD: "New password cannot be the same as the current password.",
        INVALID_OTP: "Invalid otp.",
        UNAUTHORIZED: "Unauthorized access.",
        FORBIDDEN: "You do not have permission to access this resource.",
        SERVER_ERROR: "Internal Server Error. Please try again later.",
        BAD_REQUEST: "Invalid input data.",
        TOKEN_EXPIRED: "Authentication token has expired.",
        ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
        OTP_EXPIRED: "OTP has expired. Please request a new one.",
        ALREADY_ADDED_TO_CART: 'Course already exists in cart',
        DATA_NOTFOUND: "Data not found.",
    },
    VALIDATION: {
        EMAIL_REQUIRED: "Email is required.",
        PASSWORD_REQUIRED: "Password is required.",
        INVALID_EMAIL: "Invalid email format.",
        PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
    },
};
exports.default = MESSAGES;
//# sourceMappingURL=message.js.map