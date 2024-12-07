import { BaseRepository } from "./base.repository";
import { ReviewModel } from "../models/review.model";
import { CartDocument } from "../interfaces/cart.interface";
import mongoose from 'mongoose';
import { ReviewDocument } from "../interfaces/review.interface";
import {Types} from 'mongoose';



export class ReviewRepository extends BaseRepository<ReviewDocument> {
    constructor() {
        super(ReviewModel);
    }

    async findOne(courseID:Types.ObjectId): Promise<ReviewDocument|null> {
        try { 
            console.log("lll");
                       
            return await this.model.findOne({courseId:courseID}).populate('userReviews.userId');
        } catch(error) {
            throw error;
        }
    }

    async CountDocuments(): Promise<number>{
        try{
            return await this.model.countDocuments();
        }catch(error){
            throw error
        }
    }

}