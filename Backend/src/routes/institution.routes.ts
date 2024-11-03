import { Router } from "express";
import { InstitutionController } from "../controllers/institute.controller";
import { InstituteService } from "../services/institute.service";
import { InstituteRepository } from "../repositories/institute.repository";

const router = Router();
const instituteRepository = new InstituteRepository()
const instituteService = new InstituteService(instituteRepository);
const instituteController = new InstitutionController(instituteService);

router.post('/verify-email', instituteController.verifyEmail.bind(instituteController));
router.post('/verify-Otp', instituteController.verifyOtp.bind(instituteController));
router.post('/login', instituteController.getInstitution.bind(instituteController));
router.post('/register', instituteController.createUser.bind(instituteController));

export default router;
