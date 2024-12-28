"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../interfaces/user.interface");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    status: { type: String, enum: Object.values(user_interface_1.UserStatus), default: user_interface_1.UserStatus.Active },
    purchasedCourses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Course',
            default: []
        }],
    profilePhoto: { type: String, required: false },
    quizProgress: {
        score: { type: Number, required: false, default: 0 },
        progress: { type: String, required: false, default: "" },
        rank: { type: String, required: false, default: "" }
    }
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.model.js.map