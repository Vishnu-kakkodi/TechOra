"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
class customError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.customError = customError;
//# sourceMappingURL=customError.js.map