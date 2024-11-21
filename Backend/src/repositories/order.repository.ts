import { BaseRepository } from "./base.repository";
import { OrderDocument } from "../interfaces/order.interface";
import { OrderModel } from "../models/order.model";
import mongoose from 'mongoose';


export class OrderRepository extends BaseRepository<OrderDocument>{
    constructor(){
        super(OrderModel);
    }

    async findOne(orderId: string): Promise<OrderDocument | null> {
        try {
            return await this.model.findById(orderId).populate({
                path: 'items.course'
            });
        } catch(error) {
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
        } catch(error) {
            throw error;
        }
    }

}