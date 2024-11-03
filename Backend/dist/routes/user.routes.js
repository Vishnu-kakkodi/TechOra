"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_service_1 = require("../services/user.service");
const user_repository_1 = require("../repositories/user.repository");
const router = (0, express_1.Router)();
const userRepository = new user_repository_1.UserRepository();
const userService = new user_service_1.UserService(userRepository);
const userController = new user_controller_1.UserController(userService);
router.post('/initiate-register', userController.initiateUser.bind(userController));
router.post('/verify-user', userController.verifyUser.bind(userController));
router.post('/register', userController.createUser.bind(userController));
router.post('/login', userController.getUser.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map