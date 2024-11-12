"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const base_repository_1 = require("./base.repository");
const course_model_1 = require("../models/course.model");
class CourseRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(course_model_1.CourseModel);
    }
    async find(instituteId) {
        try {
            console.log("Repoosos");
            return await this.model.find({ institutionId: instituteId });
        }
        catch (error) {
            throw error;
        }
    }
    async findById(courseId) {
        try {
            console.log("instituteId", typeof (courseId));
            const course = await this.model.findById({ _id: courseId });
            console.log(course, "ufdsakdgks");
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
            await existingCourse.save();
            return existingCourse.toObject();
        }
        catch (error) {
            console.error("Error occurred during update:", error);
            throw error;
        }
    }
    async findCourses(instituteId) {
        try {
            return await this.model.find({
                institutionId: instituteId,
                status: 'published'
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CourseRepository = CourseRepository;
//# sourceMappingURL=course.repository.js.map