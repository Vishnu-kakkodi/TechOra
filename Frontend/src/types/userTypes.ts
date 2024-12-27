import { Document, Types } from "mongoose";
import { InstituteDocument } from "./Institute/InstituteDocument";

export interface Review {
  courseId: Types.ObjectId
  userReviews: {
    userId: Types.ObjectId
    comment: string;
    rating: number;
    createdAt?: Date;
  }[];
  averageRating: number;
}

export type ReviewDocument = Review & Document;

export interface User{
    _id:string | null;
    userName:string;
    email:string;
    password:string;
    confirmPassword?:string;
    phoneNumber:string;
    profilePhoto?:string;  
}

export interface SignUpUser{
  userName:string;
  email:string;
  password:string;
  confirmPassword?:string;
  phoneNumber:string;
  profilePhoto?:string;  
}

export interface UserLogin{
    email:string;
    password:string;
}

export interface googleSign{
  email:string;
}

export interface ResponseData{
        success: boolean;
        message: string;
}

export interface InstituteViewQueryResponse {
    message:string,
    data: {
      institutes: InstituteDocument;
    };
  }

  export interface ReviewResponse{
    message:string;
    data:{
      response: ReviewDocument,
      total: number;
    }
}
