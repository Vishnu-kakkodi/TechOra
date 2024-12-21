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
import { QuizController } from "../controllers/quiz.controller";
import { QuizService } from "../services/quiz.service";
import { QuizRepository } from "../repositories/quiz.repository";
import upload from "../bucketConfig";
import { ReviewRepository } from "../repositories/review.repository";
import { ReviewService } from "../services/review.service";
import { ReviewController } from "../controllers/review.controller";
import { TutorRepository } from "../repositories/tutor.repository";



const router =  Router();
const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const cartRepository = new CartRepository();
const tutorRepository = new TutorRepository();
const userService = new UserService(userRepository,courseRepository);
const userController = new UserController(userService);
const quizRepository = new QuizRepository()
const quizService = new QuizService(quizRepository,userRepository,tutorRepository)
const quizController = new QuizController(quizService)
const courseService = new CourseService(courseRepository, cartRepository, userRepository,tutorRepository)
const cartController = new CartController(courseService)
const courseController = new CourseController(courseService,quizService)
const orderRepository = new OrderRepository()
const orderService = new OrderService(orderRepository,cartRepository,userRepository,courseRepository)
const orderController = new OrderController(orderService)
const reviewRepository = new ReviewRepository()
const reviewService = new ReviewService(reviewRepository,courseRepository)
const reviewController = new ReviewController(reviewService)


router.get('/cart-items',authMiddleware,cartController.getCartItems.bind(cartController));
router.get('/course-list',authMiddleware,courseController.userCourseList.bind(courseController));
router.get('/order-list',authMiddleware,orderController.orderList.bind(orderController));
router.get('/course-detail/:courseId',authMiddleware,courseController.courseDetail.bind(courseController));
router.get('/my-courses',authMiddleware,userController.myCourses.bind(userController));
router.get('/quiz-list',authMiddleware,quizController.quizList.bind(quizController));
router.get('/review',authMiddleware,reviewController.Review.bind(reviewController));
router.get('/home-data',userController.homeData.bind(userController));
router.get('/leaderBoard-list',authMiddleware,userController.leaderBoard.bind(userController));




router.post('/initiate-register',userController.initiateUser.bind(userController));
router.post('/verify-user',userController.verifyUser.bind(userController));
router.post('/resend-otp',userController.resendOtp.bind(userController));
// router.post('/register',userController.createUser.bind(userController));
router.post('/login',userController.getUser.bind(userController));
router.post('/googleSign',userController.googleSign.bind(userController));
router.post('/verify-email',userController.verifyEmail.bind(userController));
router.post('/verify-Otp',userController.verifyOtp.bind(userController));
router.post('/forgot-password',userController.forgotPassword.bind(userController));
router.post('/add-cart',authMiddleware,cartController.addToCart.bind(cartController));
router.patch('/remove-cart',authMiddleware,cartController.removeCart.bind(cartController));
router.post('/payment',authMiddleware,orderController.createOrder.bind(cartController));
// router.post('/payment',authMiddleware,orderController.createOrder.bind(cartController));
router.post('/payment-success',authMiddleware,orderController.paymentSuccess.bind(orderController));
router.post('/profile-photo',upload.single('profilePhoto'),authMiddleware,userController.profilePhoto.bind(userController));
router.put('/profile-update',authMiddleware,userController.profileUpdate.bind(userController));
router.post('/create-review',authMiddleware,reviewController.createReview.bind(reviewController));
router.patch('/change-password',authMiddleware,userController.changePassword.bind(userController));
router.post('/quiz-result',authMiddleware,quizController.quizResult.bind(quizController));



router.post('/logout', userController.Logout.bind(userController));






router.use(authMiddleware);

export default router; 
