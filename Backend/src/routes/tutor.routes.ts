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
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorService } from "../services/tutor.service";
import { TutorController } from "../controllers/tutor.controller";

const router = Router();
const instituteService = new InstituteService();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const tutorRepository = new TutorRepository();
const courseService = new CourseService(courseRepository,cartRepository,userRepository,tutorRepository);
const instituteController = new InstitutionController(instituteService);
const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository,userRepository,tutorRepository);
const quizController = new QuizController(quizService)
const courseController = new CourseController(courseService,quizService);
const tutorService = new TutorService(tutorRepository,userRepository);
const tutorController = new TutorController(tutorService);




router.get('/draft-course',courseController.draftCourses.bind(courseController));
router.get('/course-list',courseController.TutorCourseList.bind(courseController));
router.get('/course-detail/:courseId',courseController.courseDetailInstitute.bind(courseController));
router.get('/quiz-list',quizController.TutorListQuiz.bind(quizController));
router.get('/quiz-detail',quizController.quizDetail.bind(quizController));
router.get('/chart-data',courseController.chartData.bind(courseController));
router.get('/enrolled-students',tutorController.enrolledStudents.bind(tutorController));



router.post('/login', tutorController.tutorLogin.bind(tutorController));
router.post('/create-course',upload.single('thumbnail'),courseController.createCourse.bind(courseController));
router.post('/create-module',upload.single('video'),courseController.createModule.bind(courseController))
router.post('/create-quiz',quizController.createQuiz.bind(quizController));
router.post('/quiz-update',quizController.updateQuiz.bind(quizController));
router.post('/logout', tutorController.Logout.bind(tutorController));
router.post('/course-update',courseController.updateCourse.bind(courseController));
router.patch('/list-course',courseController.courseAction.bind(courseController));
router.post('/update-photo',upload.single('profilePic'),tutorController.uploadPhoto.bind(tutorController));
router.delete('/module-delete',courseController.moduleDelete.bind(courseController));
router.put('/profile-update',tutorController.updateProfile.bind(tutorController));





export default router;

