import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import AdminService from "../services/admin.service";
import { UserRepository } from "../repositories/user.repository";
import { InstituteRepository } from "../repositories/institute.repository";

const router = Router();
const userRepository = new UserRepository();
const instituteRepository = new InstituteRepository();
const adminService = new AdminService(userRepository,instituteRepository);
const adminController = new AdminController(adminService);

router.get('/user-list',authMiddleware,adminController.getUser.bind(adminController));
router.get('/institute-list',authMiddleware,adminController.getInstitutes.bind(adminController));
router.get('/download-document',authMiddleware,adminController.downloadDoc.bind(adminController));
router.get('/institute-view',authMiddleware,adminController.InstituteView.bind(adminController));


router.post('/verify',adminController.verifyAdmin.bind(adminController));
router.patch('/user-action/:userId',authMiddleware,adminController.userAction.bind(adminController));
router.patch('/institute-approve',authMiddleware,adminController.InstituteAction.bind(adminController));
router.patch('/institute-reject',authMiddleware,adminController.InstituteReject.bind(adminController));
router.patch('/institute-block',authMiddleware,adminController.InstituteBlock.bind(adminController));
router.patch('/institute-unblock',authMiddleware,adminController.InstituteUnBlock.bind(adminController));
router.post('/logout', adminController.Logout.bind(adminController));



export default router;
