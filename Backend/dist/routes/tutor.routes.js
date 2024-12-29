"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institute_controller_1 = require("../controllers/institute.controller");
const institute_service_1 = require("../services/institute.service");
const bucketConfig_1 = __importDefault(require("../bucketConfig"));
const course_controller_1 = require("../controllers/course.controller");
const course_service_1 = require("../services/course.service");
const course_repository_1 = require("../repositories/course.repository");
const cart_repository_1 = require("../repositories/cart.repository");
const quiz_controller_1 = require("../controllers/quiz.controller");
const quiz_repository_1 = require("../repositories/quiz.repository");
const quiz_service_1 = require("../services/quiz.service");
const user_repository_1 = require("../repositories/user.repository");
const tutor_repository_1 = require("../repositories/tutor.repository");
const tutor_service_1 = require("../services/tutor.service");
const tutor_controller_1 = require("../controllers/tutor.controller");
const wishlist_repository_1 = require("../repositories/wishlist.repository");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const instituteService = new institute_service_1.InstituteService();
const courseRepository = new course_repository_1.CourseRepository();
const cartRepository = new cart_repository_1.CartRepository();
const userRepository = new user_repository_1.UserRepository();
const tutorRepository = new tutor_repository_1.TutorRepository();
const wishlistRepository = new wishlist_repository_1.WishlistRepository();
const courseService = new course_service_1.CourseService(courseRepository, cartRepository, userRepository, tutorRepository, wishlistRepository);
const instituteController = new institute_controller_1.InstitutionController(instituteService);
const quizRepository = new quiz_repository_1.QuizRepository();
const quizService = new quiz_service_1.QuizService(quizRepository, userRepository, tutorRepository);
const quizController = new quiz_controller_1.QuizController(quizService);
const courseController = new course_controller_1.CourseController(courseService, quizService);
const tutorService = new tutor_service_1.TutorService(tutorRepository, userRepository);
const tutorController = new tutor_controller_1.TutorController(tutorService);
router.get('/draft-course', auth_middleware_1.authMiddleware, courseController.draftCourses.bind(courseController));
router.get('/course-list', auth_middleware_1.authMiddleware, courseController.TutorCourseList.bind(courseController));
router.get('/course-detail/:courseId', auth_middleware_1.authMiddleware, courseController.courseDetailInstitute.bind(courseController));
router.get('/quiz-list', auth_middleware_1.authMiddleware, quizController.TutorListQuiz.bind(quizController));
router.get('/quiz-detail', auth_middleware_1.authMiddleware, quizController.quizDetail.bind(quizController));
router.get('/chart-data', auth_middleware_1.authMiddleware, courseController.chartData.bind(courseController));
router.get('/enrolled-students', auth_middleware_1.authMiddleware, tutorController.enrolledStudents.bind(tutorController));
router.post('/login', tutorController.tutorLogin.bind(tutorController));
router.post('/create-course', auth_middleware_1.authMiddleware, bucketConfig_1.default.single('thumbnail'), courseController.createCourse.bind(courseController));
router.post('/create-module', auth_middleware_1.authMiddleware, bucketConfig_1.default.single('video'), courseController.createModule.bind(courseController));
router.post('/create-quiz', auth_middleware_1.authMiddleware, quizController.createQuiz.bind(quizController));
router.post('/quiz-update', auth_middleware_1.authMiddleware, quizController.updateQuiz.bind(quizController));
router.post('/logout', tutorController.Logout.bind(tutorController));
router.post('/course-update', auth_middleware_1.authMiddleware, courseController.updateCourse.bind(courseController));
router.patch('/list-course', auth_middleware_1.authMiddleware, courseController.courseAction.bind(courseController));
router.post('/update-photo', auth_middleware_1.authMiddleware, bucketConfig_1.default.single('profilePic'), tutorController.uploadPhoto.bind(tutorController));
router.delete('/module-delete', auth_middleware_1.authMiddleware, courseController.moduleDelete.bind(courseController));
router.put('/profile-update', auth_middleware_1.authMiddleware, tutorController.updateProfile.bind(tutorController));
exports.default = router;
//# sourceMappingURL=tutor.routes.js.map