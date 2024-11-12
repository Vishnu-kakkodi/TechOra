import { BaseRepository } from "./base.repository";
import  {TutorModel}  from "../models/tutor.model";
import { InstituteDocument } from "../interfaces/institute.interface";
import { TutorDocument } from "../interfaces/tutor.interface";


export class TutorRepository extends BaseRepository<TutorDocument> {
    constructor(){
        super(TutorModel);
    }

    // async findByEmail(instituteEmail: string): Promise <InstituteDocument | null >{
    //     try{
    //         return await this.model.findOne({instituteEmail});
    //     }catch(error){
    //         throw error;
    //     }
    // }

    // async find(): Promise<InstituteDocument[]> { 
    //     try {
    //         return await this.model.find();
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    
    // async findById(instituteId : string): Promise<InstituteDocument | null> { 
    //     try {
    //         console.log("instituteId",typeof(instituteId));
            
    //         const institute =  await this.model.findById(instituteId);
    //         console.log(institute,"ufdsakdgks");
    //         return institute;
            
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}