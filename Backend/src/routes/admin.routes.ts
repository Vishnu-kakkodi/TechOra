import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get('/user-list', adminController.getUser.bind(adminController));
router.get('/institute-list', adminController.getInstitutes.bind(adminController));
router.get('/institute-list', adminController.getInstitutes.bind(adminController));
router.get('/download-document',adminController.downloadDoc.bind(adminController));
router.get('/institute-view',adminController.InstituteView.bind(adminController));


router.post('/verify', adminController.verifyAdmin.bind(adminController));
router.patch('/user-action/:userId', adminController.userAction.bind(adminController));
router.patch('/institute-approve', adminController.InstituteAction.bind(adminController));
router.patch('/institute-reject', adminController.InstituteReject.bind(adminController));
router.patch('/institute-block', adminController.InstituteBlock.bind(adminController));
router.patch('/institute-unblock', adminController.InstituteUnBlock.bind(adminController));
router.post('/logout', adminController.Logout.bind(adminController));



export default router;
