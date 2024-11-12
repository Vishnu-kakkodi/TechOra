import { Router } from "express";
import { InstitutionController } from "../controllers/institute.controller";
import { InstituteService } from "../services/institute.service";
import { InstituteRepository } from "../repositories/institute.repository";
import upload from "../bucketConfig";
import { TutorRepository } from "../repositories/tutor.repository";
import { CourseController } from "../controllers/course.controller";
import { CourseService } from "../services/course.service";
import { CourseRepository } from "../repositories/course.repository";

const router = Router();
const instituteRepository = new InstituteRepository()
const instituteService = new InstituteService();
const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const instituteController = new InstitutionController(instituteService);
const courseController = new CourseController(courseService);



router.get('/draft-course',courseController.draftCourse.bind(courseController));
router.get('/course-list',courseController.courseList.bind(courseController));
router.get('/course-detail/:courseId',courseController.courseDetail.bind(courseController));



router.post('/verify-email', instituteController.verifyEmail.bind(instituteController));
router.post('/verify-Otp', instituteController.verifyOtp.bind(instituteController));
router.post('/login', instituteController.getInstitution.bind(instituteController));
router.post('/register', upload.single('documents'), instituteController.createInstitute.bind(instituteController));
router.post('/create-tutor',instituteController.createTutor.bind(instituteController));
router.post('/create-course',upload.single('thumbnail'),courseController.createCourse.bind(courseController));
router.post('/create-module',upload.single('video'),courseController.createModule.bind(courseController))


export default router;

