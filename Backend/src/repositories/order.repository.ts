import { BaseRepository } from "./base.repository";
import { OrderDocument } from "../interfaces/order.interface";
import { OrderModel } from "../models/order.model";
import mongoose, { FilterQuery } from 'mongoose';

export type SearchCourse = FilterQuery<{
    orderId: string;
}>;


export class OrderRepository extends BaseRepository<OrderDocument> {
    constructor() {
        super(OrderModel);
    }

    async findOne(orderId: string): Promise<OrderDocument | null> {
        try {
            return await this.model.findById(orderId).populate({
                path: 'items.course'
            });
        } catch (error) {
            throw error;
        }
    }

    async findById(orderId: any): Promise<OrderDocument | any> {
        try {
            const order = await this.model.findById({ _id: orderId });
            return order
        } catch (error: any) {
            console.error("Error occurred while fetching order:", error);

        }
    }

    async find(
        searchQuery: SearchCourse,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
    ): Promise<{ orders: OrderDocument[] | null; total: number }> {
        try {
            const orders = await this.model.find(searchQuery)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'items.course'
                });

            const total: number = await this.model.countDocuments(searchQuery);

            return { orders, total };
        } catch (error) {
            throw error;
        }
    }

    async updatePaymentStatus(orderId: mongoose.Types.ObjectId): Promise<OrderDocument | null> {
        try {
            return await this.model.findByIdAndUpdate(
                orderId,
                {
                    paymentStatus: 'Completed',
                },
                {
                    new: true
                }
            ).populate({
                path: 'items.course'
            });
        } catch (error) {
            throw error;
        }
    }

}