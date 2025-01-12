import mongoose from "mongoose";
import { CartDocument } from "../../type/cart.type";
import { IBaseRepository } from "./IBaseRepository";


export interface ICartRepository extends IBaseRepository<CartDocument>{

findCart(userId: string | null): Promise<CartDocument | null>
createCart(userId: string | null, items: any[], totalItems: number, totalPrice: number): Promise<CartDocument>
remove(userId: string | null, courseId: string | null): Promise<void>
findOneAndUpdate(userId: string | number, courseIds: mongoose.Types.ObjectId[] | undefined):Promise<void>

}