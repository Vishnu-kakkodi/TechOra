import { Document, Types } from "mongoose";
import { BaseInterface } from "./base.interface";

export interface Review extends BaseInterface {
  id:string;
  courseId: Types.ObjectId;
  userReviews: {
    userId: Types.ObjectId;
    comment: string;
    rating: number;
    createdAt?: Date;
  }[];
  averageRating: number;
}

export type ReviewDocument = Review & Document;