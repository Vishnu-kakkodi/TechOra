"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class CourseService {
    constructor(courseRepository, cartRepository) {
        this.courseRepository = courseRepository;
        this.cartRepository = cartRepository;
    }
    async createCourse(courseData) {
        try {
            if (!courseData.title || !courseData.institutionId) {
                throw new error_middleware_1.HttpException(400, 'Missing required fields');
            }
            console.log('Creating course with data:', courseData);
            const response = await this.courseRepository.create(courseData);
            console.log('Course created:', response);
            return response;
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async draftCourse(instituteId) {
        console.log("dfdd");
        const data = await this.courseRepository.find(instituteId);
        console.log(data, "Data");
        return data;
    }
    async createModule(id, moduleData) {
        try {
            const updatedCourse = await this.courseRepository.update(id, moduleData);
            return updatedCourse;
        }
        catch (error) {
            console.error(error, "Error occurred in createModule");
            throw error;
        }
    }
    async courseList(instituteId) {
        try {
            const data = await this.courseRepository.findCourses(instituteId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async courseDetail(courseId) {
        try {
            const data = await this.courseRepository.findById(courseId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async getCartItems(userId) {
        try {
            const data = await this.cartRepository.findCart(userId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map