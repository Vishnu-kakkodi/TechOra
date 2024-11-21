import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";


export interface Order extends BaseInterface {
    userId: Types.ObjectId;
    items: {
        course: Types.ObjectId;
        price: number;
        subTotal: number;
    }[];
    totalItems: number;
    totalPrice: number;
    paymentStatus: 'Pending'| 'Completed'| 'Failed';
    paymentMethod: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderDocument = Order & Document;
