import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { HttpException } from "../middleware/error.middleware";

export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    async createUser(userData: CreateUserDto): Promise<IUserDocument>{
        try{
            console.log(userData,"userData")
            return await this.userRepository.create(userData);
        }catch(error){
            throw new HttpException(404, 'Email not found');
        }
    }

    async getUser(email: string, password: string): Promise<IUserDocument | null>{
        try{
            const user =  await this.userRepository.findByEmail(email)
            if(!user){
                throw new HttpException(400, "User does not exist");
            }
            if(user.password!==password){
                throw new HttpException(400, "Password mismatch");
            }
            

            return user;

        }catch(error){
            throw error;
        }
    }
}