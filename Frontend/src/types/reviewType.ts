import { Document } from "mongoose";
import { IUserDocument } from "./userSide/leaderBoard";
import { CourseDocument } from "./courseType";

export interface Review {
  _id:string;
  courseId: CourseDocument;
    userId: IUserDocument;
    comment: string;
    rating: number;
    createdAt?: Date;
  averageRating: number;
}

export type ReviewDocument = Review & Document;