import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { IAdminService } from "../interfaces/IServiceInterface/IAdminService";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";




export interface DownloadDocResponse extends GetObjectOutput {
    Body?: Buffer;
    ContentType?: string;
}

export class AdminController {
    private adminService: IAdminService;
    constructor(
        adminService: IAdminService,
    ) { 
        this.adminService = adminService;
    }

    async verifyAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { adminEmail, adminPassword } = req.body;
            const admin = await this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            if (!admin) {
                res.json({STATUS:STATUS_CODES.UNAUTHORIZED,MESSAGE:MESSAGES.ERROR.UNAUTHORIZED});
            }
            const { accessToken, refreshToken, ...adminMail } = admin;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res,'admin',Token);
            res.status(200).json({ status:STATUS_CODES.SUCCESS,message:MESSAGES.SUCCESS.LOGIN_SUCCESS,data:admin });
        } catch (error) {
            next(error);
        }
    }

    async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const {users,total} = await this.adminService.getUser(page,limit,search,filter);
            if (!users) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            res.json({
                users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
              });        
            } catch (error) {
            next(error);
        }
    }


    async getInstitutes(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const {institutes,total} = await this.adminService.getInstitutes(page,limit,search,filter);
            if (!institutes || institutes.length === 0) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.INSTITUTE_NOT_FOUND);
            }
            console.log(institutes)
            res.json({
                institutes,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
              }); 
        } catch (error) {
            next(error);
        }
    }

    async userAction(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId: string = req.params.userId;
            const updatedUser = await this.adminService.userAction(userId);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.USER_UPDATED,
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async InstituteAction(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const instituteId = req.query.id as string;
            const updatedInstitute = await this.adminService.InstituteAction(instituteId);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.INSTITUTE_APPROVED,
                data: updatedInstitute,
            });
        } catch (error) {
            next(error)
        }
    }


    async InstituteReject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const instituteId = req.query.id as string;
            const { rejectReason } = req.body
            const updatedInstitute = await this.adminService.InstituteReject(instituteId, rejectReason);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.ERROR.APPLICATION_REJECTED,
                data: updatedInstitute,
            });
        } catch (error) {
            next(error)
        }
    }

    async InstituteBlock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const instituteId = req.query.id as string;
            const updatedInstitute = await this.adminService.InstituteBlock(instituteId);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.BLOCKED,
                data: updatedInstitute,
            });
        } catch (error) {
            next(error)
        }
    }

    async InstituteUnBlock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const instituteId = req.query.id as string;
            const updatedInstitute = await this.adminService.InstituteUnBlock(instituteId);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.BLOCKED,
                data: updatedInstitute,
            });
        } catch (error) {
            next(error)
        }
    }

    async downloadDoc(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const url = req.query.url as string;
            if (!url) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ MESSAGE:MESSAGES.ERROR.DATA_NOTFOUND });
                return;
            }
            const key = this.getKeyFromUrl(url);
            if (!key) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ MESSAGE: MESSAGES.ERROR.INVALID_FORMAT});
                return;
            }
            const data = await this.adminService.downloadDoc(url);
            if (!data.Body) {
                res.status(STATUS_CODES.NOT_FOUND).json({ MESSAGE:MESSAGES.ERROR.DATA_NOTFOUND });
                return;
            }
            res.setHeader('Content-Type', data.ContentType || 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key)}"`);
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Pragma', 'no-cache');
            res.send(data.Body);
        } catch (error) {
            next(error);
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
            return null;
        }
    }

    async InstituteView(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const instituteId = req.query.id as string;
            const institute = await this.adminService.InstituteView(instituteId);
            res.status(200).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data: institute,
            });
        } catch (error) {
            next(error)
        }
    }

    async Logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            res.clearCookie('admin', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            res.status(200).json({
                status:STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error)
        }
    }
}
