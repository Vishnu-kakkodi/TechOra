// import { Model,Document,Types } from "mongoose";
// import { BaseInterface } from "../type/base.type";
// import { HttpException } from "../middleware/error.middleware";
// import STATUS_CODES from "../constants/statusCode";
// import MESSAGES from "../constants/message";


// export abstract class BaseRepository<T extends BaseInterface & Document> {
//     constructor(protected readonly model: Model<T & Document>) {}

//     async create(data: Partial<T>): Promise<T>{
//         try{
//             const item = await this.model.create(data);
//             return item.toObject();
//         }catch(error:any){
//             console.error(error,"Error is occured")
//             if (error.name === "ValidationError") {
//                 throw new Error(
//                   "Validation failed for the provided data."
//                 );
//               }
//               if (error.code === 11000) {
//                 throw new HttpException(STATUS_CODES.CONFLICT,MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
//               }
//               throw new Error(
//                 "An unexpected error occurred during creation."
//               );
//         }
//     }
// }



import { Model, Document, Types, FilterQuery } from "mongoose";
import { BaseInterface } from "../type/base.type";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IBaseRepository } from "../interfaces/IRepositoryInterface/IBaseRepository";

export abstract class BaseRepository<T extends BaseInterface & Document> implements IBaseRepository<T>{
    constructor(protected readonly model: Model<T & Document>) {}

    async create(data: Partial<T>): Promise<T> {
        try {
            const item = await this.model.create(data);
            return item.toObject();
        } catch (error: any) {
            console.error(error, "Error occurred during creation");
            if (error.name === "ValidationError") {
                throw new Error("Validation failed for the provided data.");
            }
            if (error.code === 11000) {
                throw new HttpException(
                    STATUS_CODES.CONFLICT,
                    MESSAGES.ERROR.EMAIL_ALREADY_EXISTS
                );
            }
            throw new Error("An unexpected error occurred during creation.");
        }
    }

    // async update(id: string, data: Partial<T>): Promise<T | null> {
    //     try {
    //         const item = await this.model.findByIdAndUpdate(
    //             id,
    //             { $set: data },
    //             { new: true, runValidators: true }
    //         );
    //         if (!item) {
    //             throw new HttpException(
    //                 STATUS_CODES.NOT_FOUND,
    //                 MESSAGES.ERROR.DATA_NOTFOUND
    //             );
    //         }
    //         return item.toObject();
    //     } catch (error: any) {
    //         console.error(error, "Error occurred during update");
    //         if (error.name === "ValidationError") {
    //             throw new Error("Validation failed for the provided data.");
    //         }
    //         throw new Error("An unexpected error occurred during update.");
    //     }
    // }

//     async findOne(filter: Partial<T>): Promise<T | null> {
//       try {
//         const item = await this.model.findOne(filter as FilterQuery<T>);
//         return item ? item.toObject() : null;
//       } catch (error: any) {
//           console.error(error, "Error occurred during findOne");
//           throw new Error("An unexpected error occurred during retrieval.");
//       }
//   }
  

    // async findById(id: string): Promise<T | null> {
    //     try {
    //         const item = await this.model.findById(id);
    //         return item ? item.toObject() : null;
    //     } catch (error: any) {
    //         console.error(error, "Error occurred during findById");
    //         throw new Error("An unexpected error occurred during retrieval.");
    //     }
    // }

//     async findAll(filter: Partial<T> = {}): Promise<T[]> {
//         try {
//             const items = await this.model.find(filter as FilterQuery<T>);
//             return items.map(item => item.toObject());
//         } catch (error: any) {
//             console.error(error, "Error occurred during findAll");
//             throw new Error("An unexpected error occurred during retrieval.");
//         }
//     }

//     async delete(id: string): Promise<void> {
//         try {
//             const item = await this.model.findByIdAndDelete(id);
//             if (!item) {
//                 throw new HttpException(
//                     STATUS_CODES.NOT_FOUND,
//                     MESSAGES.ERROR.DATA_NOTFOUND
//                 );
//             }
//         } catch (error: any) {
//             console.error(error, "Error occurred during deletion");
//             throw new Error("An unexpected error occurred during deletion.");
//         }
//     }
}
