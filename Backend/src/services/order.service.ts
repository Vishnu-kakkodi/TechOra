import { OrderDocument } from "../type/order.type";
import { CartRepository } from "../repositories/cart.repository";
import { OrderRepository } from "../repositories/order.repository";
import mongoose, { FilterQuery } from 'mongoose';
import { UserRepository } from "../repositories/user.repository";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { CourseRepository } from "../repositories/course.repository";
import { IOrderService } from "../interfaces/IServiceInterface/IOrderService";
import { IOrderRepository } from "../interfaces/IRepositoryInterface/IOrderRepository";
import { ICartRepository } from "../interfaces/IRepositoryInterface/ICartRepository";
import { IUserRepository } from "../interfaces/IRepositoryInterface/IUserRepository";
import { ICourseRepository } from "../interfaces/IRepositoryInterface/ICourseRepository";


class OrderService implements IOrderService {
    private readonly orderRepository: IOrderRepository;
    private readonly cartRepository: ICartRepository;
    private readonly userRepository: IUserRepository;
    private readonly courseRepository: ICourseRepository;
    constructor(orderRepository:IOrderRepository,cartRepository:ICartRepository,userRepository:IUserRepository,courseRepository:ICourseRepository) { 
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    async getOrderById(orderId: string): Promise<OrderDocument> {
        try {
            const order = await this.orderRepository.findById(orderId)
            return order;
        } catch (error) {
            console.log(error, "Error updating payment");
            throw error;
        }
    }

    async createOrder(orderId: string, userId: string, orderItems: Array<{ courseId: string, price: number }>, paymentMethod: string, total: number): Promise<OrderDocument> {
        try {
            const courseIds = orderItems?.map((item) => new mongoose.Types.ObjectId(item.courseId));
            await this.cartRepository.findOneAndUpdate(userId, courseIds)
            return this.orderRepository.create({
                orderId,
                userId: new mongoose.Types.ObjectId(userId),
                items: orderItems.map(item => ({
                    course: new mongoose.Types.ObjectId(item.courseId),
                    price: item.price,
                    subTotal: item.price
                })),
                totalItems: orderItems.length,
                totalPrice: total,
                paymentStatus: 'Pending',
                paymentMethod: paymentMethod,
                transactionId: "abcde"
            });
        } catch (error) {
            console.log(error, "Err")
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async updatePayment(orderId: string, userId: string): Promise<OrderDocument | null> {
        try {

            // const cart = await this.cartRepository.findCart(userId)
            const mongoOrderId = new mongoose.Types.ObjectId(orderId);

            const updatedOrder = await this.orderRepository.updatePaymentStatus(mongoOrderId);

            const courseIds = updatedOrder?.items.map((item) => item.course._id);
            await this.userRepository.findByIdAndUpdate(userId, courseIds)
            // const res = await this.cartRepository.findOneAndUpdate(userId, courseIds)
            if (courseIds && courseIds.length > 0) {
                await this.courseRepository.incrementEnrolledStudents(courseIds);
            }
            return updatedOrder;
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async orderList(userId: string, page: number, limit: number, search: string, status: string, sort: string): Promise<{orders: OrderDocument[] | null; total: number}> {
        try {
            const skip = (page - 1) * limit;
      let query: FilterQuery<OrderDocument> = {};
      let sortOptions: Record<string, 1 | -1> = {};
            const id = new mongoose.Types.ObjectId(userId)
            query.userId = id;

            if (search && search.trim() !== '') {
                query.$or = [
                    { orderId: { $regex: search, $options: 'i' } },
                ];
            }

            if (status && status.trim() !== '') {
                const departmentArray = status.split(',').map((dep) => dep.trim());

                query.status = { $in: departmentArray };
            }
            switch (sort) {
                case 'newest':
                  sortOptions = { createdAt: -1 };
                  break;
                case 'oldest':
                  sortOptions = { createdAt: 1 };
                  break;
                default:
                  sortOptions = { createdAt: -1 };
              }
            const {orders, total} = await this.orderRepository.find(query, skip, limit, sortOptions)
            return {orders, total};
        } catch (error) {
            throw error
        }
    }

    async orderDetail(orderId: string): Promise<OrderDocument | null> {
        try {
            return await this.orderRepository.findOne(orderId)
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

}

export default OrderService;