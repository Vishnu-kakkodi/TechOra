import { Model,Document } from "mongoose";
import { BaseInterface } from "../interfaces/base.interface";

export abstract class BaseRepository<T extends BaseInterface & Document> {
    constructor(protected readonly model: Model<T & Document>) {}

    async create(data: Partial<T>): Promise<T>{
        try{
            console.log("baseRepo",data)
            const item = await this.model.create(data);
            return item.toObject();
        }catch(error){
            console.error(error,"Error is occured")
            throw error;
        }
    }
}