import { IUserDocument, UserStatus } from "../interfaces/user.interface";
import { InstituteDocument, InstituteStatus } from "../interfaces/institute.interface";
import { UserRepository } from "../repositories/user.repository";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import { AdminResponse } from "../interfaces/admin.interface";
import AWS from 'aws-sdk';
import { DownloadDocResponse } from "../controllers/admin.controller";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { emailSend } from "../utils/emailSend";
import { FilterQuery } from 'mongoose';
dotenv.config();

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
  }>;


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export class AdminService {
    private s3Client: S3Client;

    private userRepository: UserRepository;
    private instituteRepository: InstituteRepository

    constructor() {
        this.userRepository = new UserRepository();
        this.instituteRepository = new InstituteRepository();
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
    }

    verifyAdminCredentials(adminEmail: string, adminPassword: string): Promise<AdminResponse> {
        let admin = null;

        if (adminEmail === "admin@gmail.com" && adminPassword === "admin@123") {
            const accessToken = helperFunction.accesstoken("admin#@$123", "institute");
            const refreshToken = helperFunction.refreshtoken("admin#@$123", "institute");
            admin = {
                email: adminEmail,
                accessToken,
                refreshToken,
            };
        }

        if (!admin) {
            throw new HttpException(400, "User does not exist");
        }

        return Promise.resolve(admin);
    }


    async getUser(page:number,limit:number,search:string,status:string): Promise<{ users: IUserDocument[]; total: number }> {
        console.log("Hai request");

        try {
            const skip = (page - 1) * limit;
            let query:any = {};

            if (search && search.trim() !== '') {
                query.$or = [
                    { userName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } }
                ];
            }

            if (status && status.trim() !== '') {
                console.log('Status received:', status);
                
                query.status = { $regex: new RegExp(`^${status}$`, 'i') };
            }
    
            console.log("Query:", query);

            return await this.userRepository.find(query,skip,limit);
        } catch (error) {
            throw error;
        }
    }

    async getInstitutes(page:number,limit:number,search:string,filter:string): Promise<{ institutes: InstituteDocument[]; total: number }> {
        console.log("Hai request");

        try {
            const skip = (page - 1) * limit;
            let query:any = {};

            if (search && search.trim() !== '') {
                query.$or = [
                    { collegeName: { $regex: search, $options: 'i' } },
                    { instituteEmail: { $regex: search, $options: 'i' } },
                    { collegeCode: { $regex: search, $options: 'i' } },
                    { applicationId: { $regex: search, $options: 'i' } }

                ];
            }

            if(filter){
                query.status = filter
            }
    
            return await this.instituteRepository.find(query,skip,limit);
        } catch (error) {
            throw error;
        }
    }

    async userAction(userId: string): Promise<IUserDocument> {
        try {
            console.log(userId, "User ID");
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new HttpException(400, "User not found");
            }

            user.status = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;

            await user.save();

            console.log(user, "Updated User");

            return user;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    }

    async InstituteAction(instituteId: string): Promise<InstituteDocument> {
        try {
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            institute.status = InstituteStatus.Active;

            await institute.save();

            console.log(institute, "Updated Institute");

            return institute;
        } catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }

    
    async InstituteReject(instituteId: string, rejectReason:string): Promise<InstituteDocument> {
        try {
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            institute.status = InstituteStatus.Reject;

            await institute.save();

            const subject:string = "Application Rejected"

            await emailSend(institute.instituteEmail,subject,rejectReason);


            console.log(institute, "Updated Institute");

            return institute;
        } catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }

    async InstituteBlock(instituteId: string): Promise<InstituteDocument> {
        try {
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            institute.status = InstituteStatus.Inactive;

            await institute.save();

            console.log(institute, "Updated Institute");

            return institute;
        } catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }

    async InstituteUnBlock(instituteId: string): Promise<InstituteDocument> {
        try {
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            institute.status = InstituteStatus.Active;

            await institute.save();

            console.log(institute, "Updated Institute");

            return institute;
        } catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }

    
    async InstituteView(instituteId: string): Promise<InstituteDocument> {
        try {
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            return institute;
        } catch (error) {
            console.error("Error updating institution status:", error);
            throw error;
        }
    }


    async downloadDoc(url: string): Promise<DownloadDocResponse> {
        try {
            const key = this.getKeyFromUrl(url);

            if (!key) {
                throw new Error('Invalid URL format');
            }

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: key
            };

            const command = new GetObjectCommand(params);
            const s3Response = await this.s3Client.send(command);

            let responseBody: Buffer;
            if (s3Response.Body instanceof Readable) {
                responseBody = await this.streamToBuffer(s3Response.Body);
            } else {
                throw new Error('Unexpected response body type');
            }

            const response: DownloadDocResponse = {
                Body: responseBody,
                ContentType: s3Response.ContentType
            };

            return response;
        } catch (error) {
            console.error("Error downloading document:", error);
            throw error;
        }
    }


    private getKeyFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname.startsWith('/')
                ? urlObj.pathname.slice(1)
                : urlObj.pathname;

            return pathname
        } catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }

    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

}
