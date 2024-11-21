import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware } from '../middleware/auth.middleware';
import { CartController } from "../controllers/cart.controller";
import { CourseService } from "../services/course.service";
import { CourseRepository } from "../repositories/course.repository";
import { CartRepository } from "../repositories/cart.repository";
import { CourseController } from "../controllers/course.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";
import { OrderController } from "../controllers/order.controller";



const router =  Router();
const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const courseService = new CourseService(courseRepository, cartRepository)
const cartController = new CartController(courseService)
const courseController = new CourseController(courseService)
const orderRepository = new OrderRepository()
const orderService = new OrderService(orderRepository,cartRepository)
const orderController = new OrderController(orderService)


router.get('/cart-items',authMiddleware,cartController.getCartItems.bind(cartController));
router.get('/course-list',authMiddleware,courseController.userCourseList.bind(courseController));


router.post('/initiate-register',userController.initiateUser.bind(userController));
router.post('/verify-user',userController.verifyUser.bind(userController));
router.post('/resend-otp',userController.resendOtp.bind(userController));
// router.post('/register',userController.createUser.bind(userController));
router.post('/login',userController.getUser.bind(userController));
router.post('/verify-email',userController.verifyEmail.bind(userController));
router.post('/verify-Otp',userController.verifyOtp.bind(userController));
router.post('/forgot-password',userController.forgotPassword.bind(userController));
router.post('/add-cart',authMiddleware,cartController.addToCart.bind(cartController));
router.patch('/remove-cart',authMiddleware,cartController.removeCart.bind(cartController));
router.post('/payment',authMiddleware,orderController.createOrder.bind(cartController));
router.post('/payment',authMiddleware,orderController.createOrder.bind(cartController));
router.post('/payment-success',authMiddleware,orderController.paymentSuccess.bind(orderController));



router.use(authMiddleware);

export default router; 
