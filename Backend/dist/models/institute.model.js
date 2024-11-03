"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteModel = void 0;
const mongoose_1 = require("mongoose");
const instituteSchema = new mongoose_1.Schema({
    collegeName: { type: String, required: true },
    instituteEmail: { type: String, required: true, unique: true },
    collegeCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true }
}, { timestamps: true });
exports.InstituteModel = (0, mongoose_1.model)('Institute', instituteSchema);
//# sourceMappingURL=institute.model.js.map