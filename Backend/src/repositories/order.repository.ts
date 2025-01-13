import { BaseRepository } from "./base.repository";
import { OrderDocument } from "../type/order.type";
import { OrderModel } from "../models/order.model";
import mongoose, { FilterQuery } from 'mongoose';
import { IOrderRepository } from "../interfaces/IRepositoryInterface/IOrderRepository";

export type SearchCourse = FilterQuery<{
    orderId: string;
}>;


export class OrderRepository extends BaseRepository<OrderDocument> implements IOrderRepository {
    constructor() {
        super(OrderModel);
    }

    async findOne(orderId: string): Promise<OrderDocument | null> {
        try {
            return await this.model.findById(orderId).populate({
                path: 'items.course',
                populate: {
                    path: 'tutorId', 
                  },
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
            throw error;
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