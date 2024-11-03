"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionController = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class InstitutionController {
    constructor(instituteService) {
        this.instituteService = instituteService;
    }
    async verifyEmail(req, res, next) {
        try {
            console.log(req.body, "controller");
            const response = await this.instituteService.verifyEmail(req.body.email);
            if (response) {
                res.cookie('institutionOTP', response, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 2 * 60 * 1000,
                });
                res.status(201).json({ message: 'Successful' });
            }
            else {
                res.status(400).json({ message: 'Verification failed' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { otp } = req.body;
            console.log(otp, "controller");
            console.log("Hai");
            const CookieOtp = req.cookies.institutionOTP;
            console.log(CookieOtp);
            const response = await this.instituteService.verifyOtp(otp, CookieOtp);
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ message: 'Successfull' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async createUser(req, res, next) {
        try {
            console.log(req.body, "controller");
            console.log("Hai");
            const user = await this.instituteService.createUser(req.body);
            console.log(user);
            res.status(201).json({ user, message: 'Successfull' });
        }
        catch (error) {
            next(error);
        }
    }
    async getInstitution(req, res, next) {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail);
            if (!institute) {
                throw new error_middleware_1.HttpException(404, 'Institution not found');
            }
            res.json({ institute, message: "Login successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InstitutionController = InstitutionController;
//# sourceMappingURL=institute.controller.js.map