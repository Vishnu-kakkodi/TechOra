import { IUserDocument } from "../interfaces/user.interface";
import { InstituteDocument } from "../interfaces/institute.interface";
import { UserRepository } from "../repositories/user.repository";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";

export class AdminService {
    private userRepository: UserRepository;
    private instituteRepository: InstituteRepository

    constructor() {
        this.userRepository = new UserRepository();
        this.instituteRepository = new InstituteRepository();
    }

    verifyAdminCredentials(adminEmail: string, adminPassword: string): boolean {
        return (
            adminEmail === "admin@gmail.com" &&
            adminPassword === "admin@123"
        );
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
}
