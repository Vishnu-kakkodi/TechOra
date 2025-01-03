"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
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
    }
}, {
    timestamps: true
});
exports.CartModel = (0, mongoose_1.model)('Cart', cartSchema);
//# sourceMappingURL=cart.model.js.map