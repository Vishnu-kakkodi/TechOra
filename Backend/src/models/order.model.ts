import { Schema, model } from 'mongoose';
import { OrderDocument } from '../interfaces/order.interface';

const orderSchema = new Schema<OrderDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                course: {
                    type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true
    }
);

export const OrderModel = model<OrderDocument>('Order', orderSchema);