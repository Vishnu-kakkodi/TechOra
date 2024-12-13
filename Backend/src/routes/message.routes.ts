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
import { ChatController } from "../controllers/chat.controller";
import { ChatService } from "../services/chat.service";
import { ChatRepository } from "../repositories/chat.Repository";

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
const tutorService = new TutorService(tutorRepository);
const tutorController = new TutorController(tutorService);
const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);




router.get('/get-messages',chatController.getMessages.bind(chatController));
router.post('/send-messages',chatController.sendMessages.bind(chatController));


export default router;

