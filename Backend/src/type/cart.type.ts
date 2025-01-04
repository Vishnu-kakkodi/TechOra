import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.type";
import { CourseDocument } from "./course.type";



export interface CartItem{
    course: Types.ObjectId | CourseDocument;
    price: number;
    subTotal: number;
}

export interface Cart extends BaseInterface{
    id: string;
    userId: Types.ObjectId;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

export type CartDocument = Cart & Document