"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            course: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            subTotal: {
                type: Number,
                required: true
            }
        }
    ],
    totalItems: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=order.model.js.map