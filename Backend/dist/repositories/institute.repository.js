"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteRepository = void 0;
const base_repository_1 = require("./base.repository");
const institute_model_1 = require("../models/institute.model");
const mongoose_1 = __importDefault(require("mongoose"));
class InstituteRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(institute_model_1.InstituteModel);
    }
    async findByEmail(instituteEmail) {
        try {
            return await this.model.findOne({ instituteEmail, status: { $eq: 'Active' } });
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(applicationId) {
        try {
            return await this.model.findOne({ applicationId: applicationId, status: { $ne: 'Active' } });
        }
        catch (error) {
            throw error;
        }
    }
    async find(searchQuery, skip, limit) {
        try {
            const institutes = await this.model.find(searchQuery)
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(searchQuery);
            return { institutes, total };
        }
        catch (error) {
            throw error;
        }
    }
    async findById(institutionId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(institutionId);
            const institute = await this.model.findById(id);
            return institute;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.InstituteRepository = InstituteRepository;
//# sourceMappingURL=institute.repository.js.map