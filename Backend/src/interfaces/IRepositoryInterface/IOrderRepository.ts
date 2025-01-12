import mongoose, { FilterQuery } from "mongoose";
import { OrderDocument } from "../../type/order.type";
import { IBaseRepository } from "./IBaseRepository";

export type SearchCourse = FilterQuery<{
    orderId: string;
}>;


export interface IOrderRepository extends IBaseRepository<OrderDocument>{
    findOne(orderId: string): Promise<OrderDocument | null>
    findById(orderId: any): Promise<OrderDocument | any>
    find(
            searchQuery: SearchCourse,
            skip: number,
            limit: number,
            sortOptions: any 
        ): Promise<{ orders: OrderDocument[] | null; total: number }>
    updatePaymentStatus(orderId: mongoose.Types.ObjectId): Promise<OrderDocument | null>
}