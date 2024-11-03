import { BaseRepository } from "./base.repository";
import { InstituteModel } from "../models/institute.model";
import { InstituteDocument } from "../interfaces/institute.interface";


export class InstituteRepository extends BaseRepository<InstituteDocument> {
    constructor(){
        super(InstituteModel);
    }

    async findByEmail(instituteEmail: string): Promise <InstituteDocument | null >{
        try{
            return await this.model.findOne({instituteEmail});
        }catch(error){
            throw error;
        }
    }

    async find(): Promise<InstituteDocument[]> { 
        try {
            return await this.model.find();
        } catch (error) {
            throw error;
        }
    }
}