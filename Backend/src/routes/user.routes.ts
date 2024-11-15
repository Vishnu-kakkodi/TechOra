import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware, authorizeRole } from '../middleware/auth.middleware';
import { CartController } from "../controllers/cart.controller";
import { CourseService } from "../services/course.service";
import { CourseRepository } from "../repositories/course.repository";
import { CartRepository } from "../repositories/cart.repository";



const router =  Router();
const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const courseService = new CourseService(courseRepository, cartRepository)
const cartController = new CartController(courseService)


router.get('/cart-items',cartController.getCartItems.bind(cartController));


router.post('/initiate-register', userController.initiateUser.bind(userController));
router.post('/verify-user', userController.verifyUser.bind(userController));
router.post('/resend-otp', userController.resendOtp.bind(userController));
router.post('/register',userController.createUser.bind(userController));
router.post('/login', userController.getUser.bind(userController));
router.post('/verify-email',userController.verifyEmail.bind(userController));
router.post('/verify-Otp', userController.verifyOtp.bind(userController));
router.post('/add-cart', cartController.addToCart.bind(cartController));

router.use(authMiddleware);

export default router; 
