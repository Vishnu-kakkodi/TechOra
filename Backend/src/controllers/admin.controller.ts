import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { AdminService } from "../services/admin.service";
import { UserService } from "../services/user.service";
import { InstituteService } from "../services/institute.service";

export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
        private readonly instituteService: InstituteService
    ) {}

    async verifyAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { adminEmail, adminPassword } = req.body;

            const adminData = await this.adminService.verifyAdminCredentials(adminEmail, adminPassword);
            console.log(adminData,"ffffffffffffffffffff")

            if (!adminData) {
                throw new HttpException(401, "Unauthorized: Invalid admin credentials");
            }
            res.cookie('adminCredential', adminData, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000
            });

            res.status(200).json({ adminData,message: "Admin verified successfully" });
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
            console.log("Request came")
            const users = await this.adminService.getUser(); 
            if (!users || users.length === 0) {
                throw new HttpException(404, "No users found");
            }
            console.log(users)
            res.status(200).json({ users });
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
            console.log("Request Institute")
            const institutes = await this.adminService.getInstitutes(); 
            if (!institutes || institutes.length === 0) {
                throw new HttpException(404, "No users found");
            }
            console.log(institutes)
            res.status(200).json({ institutes });
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
            console.log("userId:", userId);
            
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
        try{
            const instituteId = req.query.id as string;
            const updatedInstitute = await this.adminService.InstituteAction(instituteId);
            console.log("institute:",instituteId);
            res.status(200).json({
                message: "Institute approved successfully",
                institute: updatedInstitute,
            });
        }catch(error){
            next(error)
        }
    }
    
}
