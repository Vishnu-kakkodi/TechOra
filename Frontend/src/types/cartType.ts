// import { Document, Types } from "mongoose";
// import { CourseDocument } from "./courseType";
// import { Course } from "./courseType";

// export interface cartResponse {
//     message: string;
//     Data: Cart | undefined;
//   }

// export interface CartItem{
//     course: Types.ObjectId | Course;
//     price: number;
//     subTotal: number;
// }

// export interface Cart{
//     id: string;
//     userId: Types.ObjectId;
//     items: CartItem[];
//     totalItems: number;
//     totalPrice: number;
// }

// export type CartDocument = Cart & Document


export interface CartItem {
    course: {
        _id: string;
        title: string;
        department: string;
        instructor: string;
        duration: string;
        description: string;
        startDate: string;
        price: number;
        status: string;
        thumbnail: string;
        institutionId: string;
        totalModules: number;
        totalDuration: number;
        modules: {
            title: string;
            description: string;
            duration: number;
            video: string;
            status: string;
            _id: string;
            createdAt: string;
            updatedAt: string;
        }[];
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    price: number;
    subTotal: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface cartResponse {
    message: string;
    Data: {
        _id: string;
        userId: string;
        items: CartItem[];
        totalItems: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
    }
}
