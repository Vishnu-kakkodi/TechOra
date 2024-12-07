import { Router } from "express";
import { InstitutionController } from "../controllers/institute.controller";
import { InstituteService } from "../services/institute.service";
import upload from "../bucketConfig";
import { CourseController } from "../controllers/course.controller";
import { CourseService } from "../services/course.service";
import { CourseRepository } from "../repositories/course.repository";
import { CartRepository } from "../repositories/cart.repository";
import { QuizController } from "../controllers/quiz.controller";
import { QuizRepository } from "../repositories/quiz.repository";
import { QuizService } from "../services/quiz.service";
import { UserRepository } from "../repositories/user.repository";

const router = Router();
const instituteService = new InstituteService();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const courseService = new CourseService(courseRepository,cartRepository,userRepository);
const instituteController = new InstitutionController(instituteService);
const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService)
const courseController = new CourseController(courseService,quizService);




router.get('/draft-course',courseController.draftCourse.bind(courseController));
router.get('/course-list',courseController.courseList.bind(courseController));
router.get('/course-detail/:courseId',courseController.courseDetailInstitute.bind(courseController));
router.get('/tutor-list',instituteController.tutorList.bind(instituteController));
router.get('/quiz-list',quizController.listQuiz.bind(quizController));
router.get('/quiz-detail',quizController.quizDetail.bind(quizController));
router.get('/chart-data',courseController.chartData.bind(courseController));


router.post('/verify-email', instituteController.verifyEmail.bind(instituteController));
router.post('/track-status', instituteController.trackStatus.bind(instituteController));
router.post('/verify-Otp', instituteController.verifyOtp.bind(instituteController));
router.post('/login', instituteController.getInstitution.bind(instituteController));
router.post('/register', upload.single('documents'), instituteController.createInstitute.bind(instituteController));
router.post('/create-tutor',instituteController.createTutor.bind(instituteController));
router.post('/create-course',upload.single('thumbnail'),courseController.createCourse.bind(courseController));
router.post('/create-module',upload.single('video'),courseController.createModule.bind(courseController))
router.post('/create-quiz',quizController.createQuiz.bind(quizController));
router.post('/quiz-update',quizController.updateQuiz.bind(quizController));
router.post('/logout', instituteController.Logout.bind(instituteController));
router.post('/course-update',courseController.updateCourse.bind(courseController));
router.patch('/list-course',courseController.courseAction.bind(courseController));
router.delete('/module-delete',courseController.moduleDelete.bind(courseController));





export default router;

