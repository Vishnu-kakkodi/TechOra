"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const user_interface_1 = require("../interfaces/user.interface");
const institute_interface_1 = require("../interfaces/institute.interface");
const user_repository_1 = require("../repositories/user.repository");
const institute_repository_1 = require("../repositories/institute.repository");
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const client_s3_1 = require("@aws-sdk/client-s3");
const stream_1 = require("stream");
const dotenv_1 = __importDefault(require("dotenv"));
const emailSend_1 = require("../utils/emailSend");
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
class AdminService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.instituteRepository = new institute_repository_1.InstituteRepository();
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }
    verifyAdminCredentials(adminEmail, adminPassword) {
        let admin = null;
        if (adminEmail === process.env.ADMIN_EMAIL && adminPassword === process.env.ADMIN_PASSWORD) {
            const accessToken = authHelper_1.helperFunction.accesstoken("admin#@$123", "admin");
            const refreshToken = authHelper_1.helperFunction.refreshtoken("admin#@$123", "admin");
            admin = {
                email: adminEmail,
                accessToken,
                refreshToken,
            };
        }
        if (!admin) {
            throw new error_middleware_1.HttpException(400, "User does not exist");
        }
        return Promise.resolve(admin);
    }
    async getUser(page, limit, search, status) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { userName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } }
                ];
            }
            if (status && status.trim() !== '') {
                query.status = { $regex: new RegExp(`^${status}$`, 'i') };
            }
            return await this.userRepository.find(query, skip, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async getInstitutes(page, limit, search, filter) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { collegeName: { $regex: search, $options: 'i' } },
                    { instituteEmail: { $regex: search, $options: 'i' } },
                    { collegeCode: { $regex: search, $options: 'i' } },
                    { applicationId: { $regex: search, $options: 'i' } }
                ];
            }
            if (filter) {
                query.status = filter;
            }
            return await this.instituteRepository.find(query, skip, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async userAction(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(400, "User not found");
            }
            user.status = user.status === user_interface_1.UserStatus.Active ? user_interface_1.UserStatus.Inactive : user_interface_1.UserStatus.Active;
            await user.save();
            return user;
        }
        catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    }
    async InstituteAction(instituteId) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            institute.status = institute_interface_1.InstituteStatus.Active;
            await institute.save();
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    async InstituteReject(instituteId, rejectReason) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            institute.status = institute_interface_1.InstituteStatus.Reject;
            await institute.save();
            const subject = "Application Rejected";
            await (0, emailSend_1.emailSend)(institute.instituteEmail, subject, rejectReason);
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    async InstituteBlock(instituteId) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            institute.status = institute_interface_1.InstituteStatus.Inactive;
            await institute.save();
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    async InstituteUnBlock(instituteId) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            institute.status = institute_interface_1.InstituteStatus.Active;
            await institute.save();
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    async InstituteView(instituteId) {
        try {
            const institute = await this.instituteRepository.findById(instituteId);
            if (!institute) {
                throw new error_middleware_1.HttpException(400, "Institute not found");
            }
            return institute;
        }
        catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    async downloadDoc(url) {
        try {
            const key = this.getKeyFromUrl(url);
            if (!key) {
                throw new Error('Invalid URL format');
            }
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key
            };
            const command = new client_s3_1.GetObjectCommand(params);
            const s3Response = await this.s3Client.send(command);
            let responseBody;
            if (s3Response.Body instanceof stream_1.Readable) {
                responseBody = await this.streamToBuffer(s3Response.Body);
            }
            else {
                throw new Error('Unexpected response body type');
            }
            const response = {
                Body: responseBody,
                ContentType: s3Response.ContentType
            };
            return response;
        }
        catch (error) {
            console.error("Error downloading document:", error);
            throw error;
        }
    }
    getKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname.startsWith('/')
                ? urlObj.pathname.slice(1)
                : urlObj.pathname;
            return pathname;
        }
        catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }
    async streamToBuffer(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map