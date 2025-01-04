import {Schema, model} from 'mongoose'
import { CartDocument } from '../type/cart.type'

const cartSchema = new Schema<CartDocument>(
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
                price:{
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
    },
    {
        timestamps: true
    }
);

export const CartModel =  model<CartDocument>('Cart',cartSchema);