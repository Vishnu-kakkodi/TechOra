import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware, authorizeRole } from '../middleware/auth.middleware';



const router =  Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


router.post('/initiate-register', userController.initiateUser.bind(userController));
router.post('/verify-user', userController.verifyUser.bind(userController));
router.post('/resend-otp', userController.resendOtp.bind(userController));
router.post('/register',userController.createUser.bind(userController));
router.post('/login', userController.getUser.bind(userController));
router.post('/verify-email',userController.verifyEmail.bind(userController));
router.post('/verify-Otp', userController.verifyOtp.bind(userController));

router.use(authMiddleware);

export default router; 
