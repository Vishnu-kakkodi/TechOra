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
import { TutorController } from "../controllers/tutor.controller";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { authMiddleware } from "../middleware/auth.middleware";
import { NotificationRepository } from "../repositories/notification.repository";
import InstituteService from "../services/institute.service";
import CourseService from "../services/course.service";
import QuizService from "../services/quiz.service";
import TutorService from "../services/tutor.service";
import { InstituteRepository } from "../repositories/institute.repository";

const router = Router();
const instituteRepository = new InstituteRepository();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const tutorRepository = new TutorRepository();
const wishlistRepository = new WishlistRepository();
const notificationRepository = new NotificationRepository();
const instituteService = new InstituteService(instituteRepository,tutorRepository);
const courseService = new CourseService(courseRepository,cartRepository,userRepository,tutorRepository,wishlistRepository);
const instituteController = new InstitutionController(instituteService);
const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository,userRepository,tutorRepository);
const quizController = new QuizController(quizService)
const courseController = new CourseController(courseService,quizService);
const tutorService = new TutorService(tutorRepository,userRepository,notificationRepository);
const tutorController = new TutorController(tutorService);




router.get('/draft-course',authMiddleware,courseController.draftCourses.bind(courseController));
router.get('/course-list',authMiddleware,courseController.TutorCourseList.bind(courseController));
router.get('/course-detail/:courseId',authMiddleware,courseController.courseDetailInstitute.bind(courseController));
router.get('/quiz-list',authMiddleware,quizController.TutorListQuiz.bind(quizController));
router.get('/quiz-detail',authMiddleware,quizController.quizDetail.bind(quizController));
router.get('/chart-data',authMiddleware,courseController.chartData.bind(courseController));
router.get('/enrolled-students',authMiddleware,tutorController.enrolledStudents.bind(tutorController));
router.get('/recent-activity',authMiddleware,tutorController.recentActivity.bind(tutorController));



router.post('/login',tutorController.tutorLogin.bind(tutorController));
router.post('/create-course',authMiddleware,upload.single('thumbnail'),courseController.createCourse.bind(courseController));
router.post('/create-module',authMiddleware,upload.single('video'),courseController.createModule.bind(courseController))
router.post('/create-quiz',authMiddleware,quizController.createQuiz.bind(quizController));
router.post('/quiz-update',authMiddleware,quizController.updateQuiz.bind(quizController));
router.post('/logout', tutorController.Logout.bind(tutorController));
router.post('/course-update',authMiddleware,courseController.updateCourse.bind(courseController));
router.patch('/list-course',authMiddleware,courseController.courseAction.bind(courseController));
router.post('/update-photo',authMiddleware,upload.single('profilePic'),tutorController.uploadPhoto.bind(tutorController));
router.delete('/module-delete',authMiddleware,courseController.moduleDelete.bind(courseController));
router.put('/profile-update',authMiddleware,tutorController.updateProfile.bind(tutorController));





export default router;

