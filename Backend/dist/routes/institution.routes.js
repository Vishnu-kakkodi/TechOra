"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institute_controller_1 = require("../controllers/institute.controller");
const institute_service_1 = require("../services/institute.service");
const institute_repository_1 = require("../repositories/institute.repository");
const router = (0, express_1.Router)();
const instituteRepository = new institute_repository_1.InstituteRepository();
const instituteService = new institute_service_1.InstituteService(instituteRepository);
const instituteController = new institute_controller_1.InstitutionController(instituteService);
router.post('/verify-email', instituteController.verifyEmail.bind(instituteController));
router.post('/verify-Otp', instituteController.verifyOtp.bind(instituteController));
router.post('/login', instituteController.getInstitution.bind(instituteController));
router.post('/register', instituteController.createUser.bind(instituteController));
exports.default = router;
//# sourceMappingURL=institution.routes.js.map