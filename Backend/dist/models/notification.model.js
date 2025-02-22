"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NotificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ['QUIZ_CREATED', 'QUIZ_UPDATED', 'QUIZ_DELETED', 'COURSE_CREATED', 'COURSE_UPDATED']
    },
    message: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    readBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    }
});
exports.default = mongoose_1.default.model('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map