"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const base_repository_1 = require("./base.repository");
const order_model_1 = require("../models/order.model");
class OrderRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(order_model_1.OrderModel);
    }
    async findOne(orderId) {
        try {
            return await this.model.findById(orderId).populate({
                path: 'items.course'
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findById(orderId) {
        try {
            const order = await this.model.findById({ _id: orderId });
            return order;
        }
        catch (error) {
            console.error("Error occurred while fetching order:", error);
        }
    }
    async find(searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const orders = await this.model.find(searchQuery)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate({
                path: 'items.course'
            });
            const total = await this.model.countDocuments(searchQuery);
            return { orders, total };
        }
        catch (error) {
            throw error;
        }
    }
    async updatePaymentStatus(orderId) {
        try {
            return await this.model.findByIdAndUpdate(orderId, {
                paymentStatus: 'Completed',
            }, {
                new: true
            }).populate({
                path: 'items.course'
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map