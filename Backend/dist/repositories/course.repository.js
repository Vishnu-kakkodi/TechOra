"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const base_repository_1 = require("./base.repository");
const course_model_1 = require("../models/course.model");
const mongoose_1 = __importDefault(require("mongoose"));
class CourseRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(course_model_1.CourseModel);
    }
    async findDraft(query, skip, limit) {
        try {
            const course = await this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .populate('tutorId');
            const total = await this.model.countDocuments(query);
            return { course, total };
        }
        catch (error) {
            throw error;
        }
    }
    async findById(courseId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(courseId);
            const course = await this.model.findById({ _id: id }).populate('tutorId');
            return course;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        try {
            const existingCourse = await this.model.findById(id);
            if (!existingCourse) {
                return null;
            }
            existingCourse.modules.push({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            existingCourse.status = 'published';
            await existingCourse.save();
            return existingCourse.toObject();
        }
        catch (error) {
            console.error("Error occurred during update:", error);
            throw error;
        }
    }
    async updateCourse(courseData, courseId) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(courseId);
            const existingCourse = await this.model.findById(id);
            if (!existingCourse) {
                return null;
            }
            if (courseData.title) {
                existingCourse.title = courseData.title;
            }
            if (courseData.department) {
                existingCourse.department = courseData.department;
            }
            if (courseData.duration) {
                existingCourse.duration = courseData.duration;
            }
            if (courseData.description) {
                existingCourse.description = courseData.description;
            }
            if (courseData.price) {
                existingCourse.price = courseData.price;
            }
            return await existingCourse.save();
        }
        catch (error) {
            console.error("Error occurred during update:", error);
            throw error;
        }
    }
    async moduleDelete(courseId, moduleId) {
        try {
            const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
            const moduleObjectId = new mongoose_1.default.Types.ObjectId(moduleId);
            await this.model.findByIdAndUpdate(courseObjectId, { $pull: { modules: { _id: moduleObjectId } } }, { new: true });
            return;
        }
        catch (error) {
            console.error("Error occurred during update:", error);
            throw error;
        }
    }
    async findCourses(filterKey, filterValue, searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const filter = {
                [filterKey]: filterValue,
                status: 'published',
                ...searchQuery,
            };
            const course = await this.model
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('tutorId');
            const total = await this.model.countDocuments(filter);
            return { course, total };
        }
        catch (error) {
            throw error;
        }
    }
    async find() {
        try {
            return await this.model.find({ status: 'published', isListed: true }).populate('institutionId');
        }
        catch (error) {
            throw error;
        }
    }
    async findCourse(searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const course = await this.model.find({ isListed: true, status: 'published', ...searchQuery })
                .select({ 'modules.video': 0 })
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate([{
                    path: 'tutorId',
                    select: 'tutorname department education experiance profilePic'
                }, {
                    path: 'institutionId',
                    select: 'collegeName'
                }
            ]);
            console.log(course);
            const totalCourse = await this.model.countDocuments({ isListed: true, status: 'published' });
            const total = await this.model.countDocuments({ isListed: true, status: 'published' }, searchQuery);
            const department = await this.model.distinct("department");
            return { course, total, department, totalCourse };
        }
        catch (error) {
            throw error;
        }
    }
    async findMyCourse(MyCourses, searchQuery, skip, limit) {
        try {
            const query = {
                _id: { $in: MyCourses },
                ...searchQuery,
            };
            const course = await this.model
                .find(query)
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return { course, total };
        }
        catch (error) {
            throw error;
        }
    }
    async chartData(instituteId) {
        try {
            const published = await this.model.countDocuments({ status: 'published' });
            const course = await this.model.find({ institutionId: instituteId, status: 'published' })
                .sort({ createdAt: -1 })
                .limit(4);
            const draft = await this.model.countDocuments({ status: 'draft' });
            const listed = await this.model.countDocuments({ isListed: true });
            const unlisted = await this.model.countDocuments({ status: false });
            return {
                published,
                draft,
                listed,
                unlisted,
                course
            };
        }
        catch (error) {
            throw error;
        }
    }
    async homeData() {
        try {
            const published = await this.model.countDocuments({ status: 'published' });
            const course = await this.model.find({ status: 'published' })
                .sort({ createdAt: -1 })
                .limit(4)
                .populate('tutorId');
            return {
                course
            };
        }
        catch (error) {
            throw error;
        }
    }
    async incrementEnrolledStudents(courseIds) {
        await this.model.updateMany({ _id: { $in: courseIds } }, { $inc: { enrolledStudents: 1 } });
    }
}
exports.CourseRepository = CourseRepository;
//# sourceMappingURL=course.repository.js.map