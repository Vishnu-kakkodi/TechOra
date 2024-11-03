import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";


const router =  Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/initiate-register', userController.initiateUser.bind(userController));
router.post('/verify-user', userController.verifyUser.bind(userController));
router.post('/register',userController.createUser.bind(userController));
router.post('/login', userController.getUser.bind(userController));

export default router; 
