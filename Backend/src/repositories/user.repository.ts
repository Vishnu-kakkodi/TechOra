import { BaseRepository } from "./base.repository";
import { UserModel } from "../models/user.model";
import { IUserDocument } from "../interfaces/user.interface";
import { customError } from "../customError";
import { HttpException } from "../middleware/error.middleware";


export class UserRepository extends BaseRepository<IUserDocument> {
    constructor(){
        super(UserModel);
    }

    async findByEmail(email: string): Promise <IUserDocument | null >{
        try{
            return await this.model.findOne({email});
        }catch(error){
            throw new HttpException(400, "Email does not exist");
        }
    }

    async find(): Promise<IUserDocument[]> { 
        try {
            return await this.model.find();
        } catch (error) {
            throw error;
        }
    }
}