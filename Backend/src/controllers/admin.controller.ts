import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { AdminService } from "../services/admin.service";
import { setCookie } from "../helperFunction/cookieUtils";
import { GetObjectOutput } from 'aws-sdk/clients/s3';




export interface DownloadDocResponse extends GetObjectOutput {
    Body?: Buffer;
    ContentType?: string;
}

export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    async verifyAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { adminEmail, adminPassword } = req.body;
            const admin = await this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            if (!admin) {
                throw new HttpException(401, "Unauthorized: Invalid admin credentials");
            }
            const { accessToken, refreshToken, ...adminMail } = admin;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setCookie(res,'admin',Token);
            res.status(200).json({ admin, message: "Admin verified successfully" });
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
            console.log(page,limit,search,"Field")
            const {users,total} = await this.adminService.getUser(page,limit,search,filter);
            if (!users) {
                throw new HttpException(404, "No users found");
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
                throw new HttpException(404, "No users found");
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
                message: "User status updated successfully",
                user: updatedUser,
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
                message: "Institute approved successfully",
                institute: updatedInstitute,
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
                message: "Application rejected",
                institute: updatedInstitute,
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
                message: "Institute Blocked",
                institute: updatedInstitute,
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
                message: "Institute Unblocked",
                institute: updatedInstitute,
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
                res.status(400).json({ error: 'URL is required' });
                return;
            }
            const key = this.getKeyFromUrl(url);
            if (!key) {
                res.status(400).json({ error: 'Invalid URL format' });
                return;
            }
            const data = await this.adminService.downloadDoc(url);
            if (!data.Body) {
                res.status(404).json({ error: 'Document not found' });
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
            console.log(pathname)
            return pathname
        } catch (error) {
            console.error('Error parsing URL:', error);
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
                message: "Data fetched successfully",
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
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error)
        }
    }
}
