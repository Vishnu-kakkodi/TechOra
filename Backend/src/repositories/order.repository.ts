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

    async findById(orderId: any): Promise<OrderDocument | any> {
        try {
  
            const order = await this.model.findById({_id:orderId});

            return order
        } catch (error: any) {
            console.error("Error occurred while fetching order:", error);

        }
    }

    async find(userId: string): Promise<OrderDocument[] | null> {
        try {
            console.log("lalal");
            const id = new mongoose.Types.ObjectId(userId)
            console.log(id);
            

            return await this.model.find({userId:id}).populate({
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