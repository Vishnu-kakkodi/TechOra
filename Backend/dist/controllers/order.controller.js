"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const authHelper_1 = require("../helperFunction/authHelper");
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const orderIdGenerate_1 = __importDefault(require("../utils/orderIdGenerate"));
dotenv_1.default.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET, {
    apiVersion: process.env.STRIPE_API_VERSION,
});
function isExistingOrder(order) {
    return 'orderId' in order.orderDetails;
}
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(req, res, next) {
        try {
            const { orderItems, total } = req.body.orderDetails;
            if (!Array.isArray(orderItems) || typeof total !== 'number') {
                throw new Error('Invalid order details');
            }
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            let order;
            const orderId = orderIdGenerate_1.default.generateID();
            if (isExistingOrder(req.body)) {
                order = await this.orderService.getOrderById(req.body.orderDetails.orderId);
                if (!order) {
                    throw new Error('Order not found');
                }
            }
            else {
                order = await this.orderService.createOrder(orderId, userId, orderItems, total);
            }
            const lineItems = orderItems.map(product => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: [product.thumbnail]
                    },
                    unit_amount: Math.round(product.price * 100)
                },
                quantity: 1
            }));
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `http://localhost:5173/success?orderId=${order._id}`,
                cancel_url: `http://localhost:5173/cancel?orderId=${order._id}`,
            });
            res.json({
                id: session.id,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async paymentSuccess(req, res, next) {
        try {
            const orderId = req.body.orderId;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const order = await this.orderService.updatePayment(orderId, userId);
            res.json({
                order
            });
        }
        catch (error) {
            next(error);
        }
    }
    async orderList(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
            const search = req.query.search;
            const filter = req.query.filter;
            const sort = req.query.sort;
            const orderId = req.body.orderId;
            const Token = req.cookies.user;
            const token = Token.accessToken;
            if (!token) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const requiredRole = "user";
            const userId = (0, authHelper_1.decodedToken)(token, requiredRole);
            const { orders, total } = await this.orderService.orderList(userId, page, limit, search, filter, sort);
            res.json({
                orders,
                total
            });
        }
        catch (error) {
            next(error);
        }
    }
    async orderDetail(req, res, next) {
        try {
            const orderId = req.params.orderId;
            const order = await this.orderService.orderDetail(orderId);
            res.status(201).json({
                order
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map