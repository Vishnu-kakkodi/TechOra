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
const adminController = new AdminController(adminService);

router.get('/user-list', adminController.getUser.bind(adminController));
router.get('/institute-list', adminController.getInstitutes.bind(adminController));
router.get('/institute-list', adminController.getInstitutes.bind(adminController));
router.get('/download-document',adminController.downloadDoc.bind(adminController));

router.post('/verify', adminController.verifyAdmin.bind(adminController));
router.patch('/user-action/:userId', adminController.userAction.bind(adminController));
router.patch('/institute-approve', adminController.InstituteAction.bind(adminController));
router.patch('/institute-reject', adminController.InstituteReject.bind(adminController));
router.patch('/institute-block', adminController.InstituteBlock.bind(adminController));
router.patch('/institute-unblock', adminController.InstituteUnBlock.bind(adminController));


export default router;
