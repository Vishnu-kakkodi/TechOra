import { Router } from "express";
import { InstitutionController } from "../controllers/institute.controller";
import upload from "../bucketConfig";
import { CourseController } from "../controllers/course.controller";
import { CourseRepository } from "../repositories/course.repository";
import { CartRepository } from "../repositories/cart.repository";
import { QuizController } from "../controllers/quiz.controller";
import { QuizRepository } from "../repositories/quiz.repository";
import { UserRepository } from "../repositories/user.repository";
import { TutorRepository } from "../repositories/tutor.repository";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { authMiddleware } from "../middleware/auth.middleware";
import CourseService from "../services/course.service";
import InstituteService from "../services/institute.service";
import QuizService from "../services/quiz.service";
import { InstituteRepository } from "../repositories/institute.repository";

const router = Router();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const tutorRepository = new TutorRepository();
const wishlistRepository = new WishlistRepository();
const instituteRepository = new InstituteRepository();
const instituteService = new InstituteService(instituteRepository,tutorRepository);
const courseService = new CourseService(courseRepository,cartRepository,userRepository,tutorRepository,wishlistRepository);
const instituteController = new InstitutionController(instituteService);
const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository,userRepository,tutorRepository);
const quizController = new QuizController(quizService)
const courseController = new CourseController(courseService,quizService);




router.get('/draft-course',authMiddleware,courseController.draftCourse.bind(courseController));
router.get('/course-list',authMiddleware,courseController.courseList.bind(courseController));
router.get('/course-detail/:courseId',authMiddleware,courseController.courseDetailInstitute.bind(courseController));
router.get('/tutor-list',authMiddleware,instituteController.tutorList.bind(instituteController));
router.get('/quiz-list',authMiddleware,quizController.listQuiz.bind(quizController));
router.get('/quiz-detail',authMiddleware,quizController.quizDetail.bind(quizController));
router.get('/chart-data',authMiddleware,courseController.chartData.bind(courseController));
router.get('/department-list',authMiddleware,instituteController.getDepartment.bind(instituteController));


router.post('/verify-email', instituteController.verifyEmail.bind(instituteController));
router.post('/track-status', instituteController.trackStatus.bind(instituteController));
router.post('/verify-Otp', instituteController.verifyOtp.bind(instituteController));
router.post('/login', instituteController.getInstitution.bind(instituteController));
router.post('/register', upload.single('documents'), instituteController.createInstitute.bind(instituteController));
router.post('/create-tutor',authMiddleware,instituteController.createTutor.bind(instituteController));
router.post('/logout', instituteController.Logout.bind(instituteController));
router.post('/add-department',authMiddleware,instituteController.addDepartment.bind(instituteController));
router.patch('/list-course',authMiddleware,courseController.courseAction.bind(courseController));
router.delete('/module-delete',authMiddleware,courseController.moduleDelete.bind(courseController));





export default router;

