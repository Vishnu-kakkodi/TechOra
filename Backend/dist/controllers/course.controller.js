"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class CourseController {
    constructor(courseService) {
        this.createCourse = async (req, res, next) => {
            try {
                console.log("Control");
                const courseData = req.body;
                if (req.file) {
                    courseData.thumbnail = req.file.location;
                }
                if (!courseData.institutionId) {
                    throw new error_middleware_1.HttpException(400, 'Institute ID is required');
                }
                console.log('Course Data:', courseData);
                const course = await this.courseService.createCourse(courseData);
                res.status(201).json({
                    status: 'success',
                    message: 'Course created successfully',
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.draftCourse = async (req, res, next) => {
            const instituteCredential = req.cookies.instituteCredential;
            const course = await this.courseService.draftCourse(instituteCredential._id);
            res.status(201).json({
                message: "Approved",
                data: course
            });
        };
        this.createModule = async (req, res, next) => {
            const instituteCredential = req.cookies.instituteCredential;
            const courseData = req.body;
            if (req.file) {
                courseData.video = req.file.location;
            }
            console.log(courseData, "oooooo");
            const course = await this.courseService.createModule(courseData.draftId, courseData);
            console.log(course, "Courseeeeeeeeeeeeeee");
            res.status(201).json({
                message: "Approved",
                data: course
            });
        };
        this.courseList = async (req, res, next) => {
            try {
                const instituteCredential = req.cookies.instituteCredential;
                const course = await this.courseService.courseList(instituteCredential._id);
                res.status(201).json({
                    message: "Course fetched successfully",
                    data: course
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseDetail = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                console.log(courseId, "{fdgfgsg}");
                const course = await this.courseService.courseDetail(courseId);
                console.log(course, "CourseDtatatat");
                const response = {
                    message: "Success",
                    Data: course,
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.courseService = courseService;
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map