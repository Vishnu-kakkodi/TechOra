import { OrderDocument } from "../interfaces/order.interface";
import { CartRepository } from "../repositories/cart.repository";
import { OrderRepository } from "../repositories/order.repository";
import mongoose from 'mongoose';
import { UserRepository } from "../repositories/user.repository";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly cartRepository: CartRepository,
        private readonly userRepository: UserRepository,

    ) { }

    async getOrderById(orderId: string): Promise<OrderDocument> {
        try {
            console.log("kai");
            const order = await this.orderRepository.findById(orderId)            
            return order;
        } catch(error) {
            console.log(error, "Error updating payment");
            throw error;
        }
    }

    async createOrder(userId: string, orderItems: Array<{courseId: string, price: number}>, total: number) {
        try{            
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
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async updatePayment(orderId: string, userId: string): Promise<OrderDocument | null> {
        try {

            const cart = await this.cartRepository.findCart(userId)
            const mongoOrderId = new mongoose.Types.ObjectId(orderId);
            
            const updatedOrder = await this.orderRepository.updatePaymentStatus(mongoOrderId);

            const courseIds = updatedOrder?.items.map((item) => item.course._id);
            await this.userRepository.findByIdAndUpdate(userId,courseIds)
            const res = await this.cartRepository.findOneAndUpdate(userId,courseIds)
            
            return updatedOrder;
        } catch(error) {
            console.log(error, "Error updating payment");
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async orderList(userId: string): Promise<OrderDocument[] | null> {
        try {            
            const order = await this.orderRepository.find(userId)            
            return order;
        } catch(error) {
            console.log(error, "Error updating payment");
            throw error
        }
    }
}