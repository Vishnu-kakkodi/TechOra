import { BaseRepository } from "./base.repository";
import { InstituteModel } from "../models/institute.model";
import { InstituteDocument } from "../interfaces/institute.interface";


export class InstituteRepository extends BaseRepository<InstituteDocument> {
    constructor(){
        super(InstituteModel);
    }

    async findByEmail(instituteEmail: string): Promise <InstituteDocument | null >{
        try{
            return await this.model.findOne({instituteEmail,status: { $eq: 'Active' } });
        }catch(error){
            throw error;
        }
    }

    async findOne(applicationId: string): Promise <InstituteDocument | null >{
        try{
            console.log(typeof(applicationId))
            return await this.model.findOne({ applicationId: applicationId,status: { $ne: 'Active' }  });
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

    
    async findById(instituteId : string): Promise<InstituteDocument | null> { 
        try {
            console.log("instituteId",typeof(instituteId));
            
            const institute =  await this.model.findById(instituteId);
            console.log(institute,"ufdsakdgks");
            return institute;
            
        } catch (error) {
            throw error;
        }
    }
}