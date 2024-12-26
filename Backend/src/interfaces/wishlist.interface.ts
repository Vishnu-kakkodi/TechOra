import { Document,Types } from "mongoose";
import { BaseInterface } from "./base.interface";
import { CourseDocument } from "./course.interface";


export interface WishlistItem{
    course: Types.ObjectId | CourseDocument;
}

export interface Wishlist extends BaseInterface{
    id: string;
    userId: Types.ObjectId;
    items: WishlistItem[];
}

export type WishlistDocument = Wishlist & Document;