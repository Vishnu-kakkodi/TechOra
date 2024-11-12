import { IUserDocument, UserStatus } from "../interfaces/user.interface";
import { InstituteDocument, InstituteStatus } from "../interfaces/institute.interface";
import { UserRepository } from "../repositories/user.repository";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import helperFunction from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import { AdminResponse } from "../interfaces/admin.interface";

export class AdminService {
    private userRepository: UserRepository;
    private instituteRepository: InstituteRepository

    constructor() {
        this.userRepository = new UserRepository();
        this.instituteRepository = new InstituteRepository();
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
    

    async getUser(): Promise<IUserDocument[]> { 
        console.log("Hai request");
        
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw error;
        }
    }

    async getInstitutes(): Promise<InstituteDocument[]> { 
        console.log("Hai request");
        
        try {
            return await this.instituteRepository.find();
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

    async InstituteAction(instituteId: string): Promise<InstituteDocument>{
        try{
            const institute = await this.instituteRepository.findById(instituteId);

            if (!institute) {
                throw new HttpException(400, "Institute not found");
            }

            institute.status = InstituteStatus.Active;
    
            await institute.save();
            
            console.log(institute, "Updated User");
    
            return institute;
        }catch(error){
            console.error("Error updating institution status:", error);
            throw error;
        }
    }
    
}
