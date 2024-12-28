"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class OrderService {
    constructor(orderRepository, cartRepository, userRepository, courseRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    async getOrderById(orderId) {
        try {
            const order = await this.orderRepository.findById(orderId);
            return order;
        }
        catch (error) {
            console.log(error, "Error updating payment");
            throw error;
        }
    }
    async createOrder(orderId, userId, orderItems, total) {
        try {
            return this.orderRepository.create({
                orderId,
                userId: new mongoose_1.default.Types.ObjectId(userId),
                items: orderItems.map(item => ({
                    course: new mongoose_1.default.Types.ObjectId(item.courseId),
                    price: item.price,
                    subTotal: item.price
                })),
                totalItems: orderItems.length,
                totalPrice: total,
                paymentStatus: 'Pending',
                paymentMethod: 'Stripe',
                transactionId: "abcde"
            });
        }
        catch (error) {
            console.log(error, "Err");
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async updatePayment(orderId, userId) {
        try {
            const cart = await this.cartRepository.findCart(userId);
            const mongoOrderId = new mongoose_1.default.Types.ObjectId(orderId);
            const updatedOrder = await this.orderRepository.updatePaymentStatus(mongoOrderId);
            const courseIds = updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.items.map((item) => item.course._id);
            await this.userRepository.findByIdAndUpdate(userId, courseIds);
            const res = await this.cartRepository.findOneAndUpdate(userId, courseIds);
            if (courseIds && courseIds.length > 0) {
                await this.courseRepository.incrementEnrolledStudents(courseIds);
            }
            return updatedOrder;
        }
        catch (error) {
            console.log(error, "Error updating payment");
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
    async orderList(userId, page, limit, search, status, sort) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            const id = new mongoose_1.default.Types.ObjectId(userId);
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
            const { orders, total } = await this.orderRepository.find(query, skip, limit, sortOptions);
            return { orders, total };
        }
        catch (error) {
            console.log(error, "Error updating payment");
            throw error;
        }
    }
    async orderDetail(orderId) {
        try {
            return await this.orderRepository.findOne(orderId);
        }
        catch (error) {
            console.log(error, "Error updating payment");
            throw new error_middleware_1.HttpException(statusCode_1.default.SERVER_ERROR, message_1.default.ERROR.SERVER_ERROR);
        }
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map