import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { InstituteService } from "../services/institute.service";
import { InstituteRepository } from "../repositories/institute.repository";

const router = Router();
const adminService = new AdminService();
const userRepository = new UserRepository()
const instituteRepository = new InstituteRepository()
const userService = new UserService(userRepository);
const instituteService = new InstituteService();
const adminController = new AdminController(adminService,userService,instituteService);
const userController = new UserController(userService)

router.post('/verify', adminController.verifyAdmin.bind(adminController));
router.get('/user-list', adminController.getUser.bind(adminController));
router.get('/institute-list', adminController.getInstitutes.bind(adminController));
router.patch('/user-action/:userId', adminController.userAction.bind(adminController));
router.patch('/institute-action', adminController.InstituteAction.bind(adminController));

export default router;
