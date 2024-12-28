"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModel = void 0;
const mongoose_1 = require("mongoose");
const tutorSchema = new mongoose_1.Schema({
    department: { type: String, required: true },
    tutorname: { type: String, required: true },
    tutorEmail: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    education: { type: String, required: true },
    experiance: { type: String, required: true },
    gender: { type: String, required: true },
    institutionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Institute', required: true },
    profilePic: { type: String, required: false, default: '' },
}, { timestamps: true });
exports.TutorModel = (0, mongoose_1.model)('Tutor', tutorSchema);
//# sourceMappingURL=tutor.model.js.map