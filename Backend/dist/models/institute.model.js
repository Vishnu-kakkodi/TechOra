"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteModel = void 0;
const mongoose_1 = require("mongoose");
const institute_interface_1 = require("../interfaces/institute.interface");
const instituteSchema = new mongoose_1.Schema({
    collegeName: { type: String, required: true },
    instituteEmail: { type: String, required: true, unique: true },
    collegeCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    documentUrl: { type: String, required: true },
    applicationId: { type: String, required: true },
    status: { type: String, enum: Object.values(institute_interface_1.InstituteStatus), default: institute_interface_1.InstituteStatus.Pending }
}, { timestamps: true });
exports.InstituteModel = (0, mongoose_1.model)('Institute', instituteSchema);
//# sourceMappingURL=institute.model.js.map