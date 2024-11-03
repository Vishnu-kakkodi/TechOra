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

            const isAdminValid = this.adminService.verifyAdminCredentials(adminEmail, adminPassword);

            if (!isAdminValid) {
                throw new HttpException(401, "Unauthorized: Invalid admin credentials");
            }

            res.status(200).json({ message: "Admin verified successfully" });
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
            const users = await this.adminService.getUser(); // Expecting an array of users
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
}
