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
            const CookieData = req.cookies.institutionOTP;
            console.log(CookieData);
            const response = await this.instituteService.verifyOtp(otp, CookieData[0]);
            const email = CookieData[1];
            if (response) {
                res.clearCookie('userData');
                res.status(201).json({ email, message: 'Successfull' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async createInstitute(req, res, next) {
        var _a;
        try {
            const fileLocation = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
            if (!fileLocation) {
                res.status(400).json({ message: "File upload failed." });
            }
            console.log(req.file, "File name");
            console.log(req.body, "controller");
            console.log("Hai");
            const instituteData = {
                ...req.body,
                documentUrl: fileLocation,
            };
            const institute = await this.instituteService.createInstitute(instituteData);
            console.log(institute, "ggggggggggggggggggggg");
            res.cookie('instituteCredential', institute, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000
            });
            res.status(201).json({ institute, message: 'Successfull' });
        }
        catch (error) {
            next(error);
        }
    }
    async getInstitution(req, res, next) {
        try {
            const institute = await this.instituteService.getUgetInstitution(req.body.instituteEmail, req.body.collegeCode);
            console.log(institute, "yyyyyyyyyyyyyyyyyyyyyy");
            if (!institute) {
                throw new error_middleware_1.HttpException(404, 'Institution not found');
            }
            res.cookie('instituteCredential', institute, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            res.json({ institute, message: "Login successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async createTutor(req, res, next) {
        try {
            console.log("data");
            const instituteId = req.query.id;
            const tutorDetail = req.body;
            console.log(instituteId, tutorDetail, "Data");
            const tutorData = {
                ...tutorDetail,
                instituteId
            };
            const tutor = this.instituteService.createTutor(tutorData);
        }
        catch (error) {
            next(error);
        }
    }
    async createCourse(req, res, next) {
        try {
            const courseData = req.body;
            if (req.file) {
                courseData.thumbnailUrl = req.file.location;
            }
            console.log('Course Data:', courseData);
            res.status(201).json({
                status: 'success',
                message: 'Course created successfully',
                data: courseData
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InstitutionController = InstitutionController;
//# sourceMappingURL=institute.controller.js.map