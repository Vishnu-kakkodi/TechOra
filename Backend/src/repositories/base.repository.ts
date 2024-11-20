import { Model,Document } from "mongoose";
import { BaseInterface } from "../interfaces/base.interface";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


export class RepositoryError extends Error {
    public statusCode: number;
    public details: any;
  
    constructor(message: string, statusCode: number, details?: any) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);

    }
  }

export abstract class BaseRepository<T extends BaseInterface & Document> {
    constructor(protected readonly model: Model<T & Document>) {}

    async create(data: Partial<T>): Promise<T>{
        try{
            const item = await this.model.create(data);
            return item.toObject();
        }catch(error:any){
            console.error(error,"Error is occured")
            if (error.name === "ValidationError") {
                throw new RepositoryError(
                  "Validation failed for the provided data.",
                  400,
                  error.errors
                );
              }
              if (error.code === 11000) {
                throw new HttpException(STATUS_CODES.CONFLICT,MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
              }
              throw new RepositoryError(
                "An unexpected error occurred during creation.",
                500, 
                error.message
              );
        }
    }
}