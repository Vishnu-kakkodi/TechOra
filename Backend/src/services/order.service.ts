import { OrderDocument } from "../interfaces/order.interface";
import { CartRepository } from "../repositories/cart.repository";
import { OrderRepository } from "../repositories/order.repository";
import mongoose from 'mongoose';


export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly cartRepository: CartRepository,
    ) { }

    async createOrder(userId: string, orderItems: Array<{courseId: string, price: number}>, total: number) {
        try{
            console.log("Services");
            
            return this.orderRepository.create({
                userId: new mongoose.Types.ObjectId(userId),
                items: orderItems.map(item => ({
                    course: new mongoose.Types.ObjectId(item.courseId),
                    price: item.price,
                    subTotal: item.price
                })),
                totalItems: orderItems.length,  
                totalPrice: total,
                paymentStatus: 'Pending',
                paymentMethod: 'Stripe',
                transactionId: "abcde"
            });
        }catch(error){
            console.log(error,"Err")
            throw error
        }
    }

    async updatePayment(orderId: string, userId: string): Promise<OrderDocument | null> {
        try {

            const cart = await this.cartRepository.findCart(userId)
            const mongoOrderId = new mongoose.Types.ObjectId(orderId);
            
            const updatedOrder = await this.orderRepository.updatePaymentStatus(mongoOrderId);

            const courseIds = updatedOrder?.items.map((item) => item.course._id);

            const res = await this.cartRepository.findOneAndUpdate(userId,courseIds)
            
            return updatedOrder;
        } catch(error) {
            console.log(error, "Error updating payment");
            throw error;
        }
    }
}