"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorRepository = void 0;
const base_repository_1 = require("./base.repository");
const tutor_model_1 = require("../models/tutor.model");
const mongoose_1 = __importDefault(require("mongoose"));
class TutorRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(tutor_model_1.TutorModel);
    }
    async findById(tutorId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(tutorId);
            return await this.model.findById(id);
        }
        catch (error) {
            throw error;
        }
    }
    async findByEmail(instituteEmail) {
        try {
            return await this.model.findOne({ instituteEmail });
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(tutorEmail) {
        try {
            return await this.model.findOne({ tutorEmail })
                .populate({
                path: 'institutionId',
                select: 'collegeName'
            });
        }
        catch (error) {
            throw error;
        }
    }
    async find() {
        try {
            return await this.model.find();
        }
        catch (error) {
            throw error;
        }
    }
    async findTutors(institutionId) {
        try {
            return await this.model.find({ institutionId: institutionId });
        }
        catch (error) {
            throw error;
        }
    }
    async countTutorsByDepartment(filterKey, filterValue, searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        var _a;
        try {
            const id = new mongoose_1.default.Types.ObjectId(filterValue);
            const filter = {
                [filterKey]: id,
                ...searchQuery,
            };
            const departmentCounts = await this.model.aggregate([
                {
                    $match: filter
                },
                {
                    $group: {
                        _id: "$department",
                        tutorCount: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        department: "$_id",
                        tutorCount: 1
                    }
                },
                { $sort: sortOptions },
                { $skip: skip },
                { $limit: limit }
            ]);
            const total = await this.model.aggregate([
                {
                    $match: filter
                },
                {
                    $group: {
                        _id: "$department",
                        tutorCount: { $sum: 1 }
                    }
                },
                { $count: "totalDepartments" }
            ]);
            console.log(departmentCounts, total);
            return {
                departments: departmentCounts,
                total: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.totalDepartments) || 0
            };
        }
        catch (error) {
            console.error('Error counting tutors by department:', error);
            throw error;
        }
    }
    async UpdateProfile(tutorId, updatedData) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(tutorId);
            const updateFields = Object.fromEntries(Object.entries(updatedData).filter(([_, value]) => value !== undefined));
            if (Object.keys(updateFields).length === 0) {
                throw new Error('No valid fields to update');
            }
            const updatedTutor = await this.model.findByIdAndUpdate(id, { $set: updateFields }, {
                new: true,
                runValidators: true
            }).populate({
                path: 'institutionId',
                select: 'collegeName'
            });
            if (!updatedTutor) {
                throw new Error('Tutor not found');
            }
            return updatedTutor;
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new Error('Invalid data provided for update');
            }
            throw error;
        }
    }
}
exports.TutorRepository = TutorRepository;
//# sourceMappingURL=tutor.repository.js.map