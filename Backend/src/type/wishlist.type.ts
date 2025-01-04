import { Document,Types } from "mongoose";
import { BaseInterface } from "./base.type";
import { CourseDocument } from "./course.type";


export interface WishlistItem{
    course: Types.ObjectId | CourseDocument;
}

export interface Wishlist extends BaseInterface{
    id: string;
    userId: Types.ObjectId;
    items: WishlistItem[];
}

export type WishlistDocument = Wishlist & Document;