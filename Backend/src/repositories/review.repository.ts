import { BaseRepository } from "./base.repository";
import { ReviewModel } from "../models/review.model";
import { CartDocument } from "../type/cart.type";
import mongoose from 'mongoose';
import { ReviewDocument } from "../type/review.type";
import { Types } from 'mongoose';
import { IReviewRepository } from "../interfaces/IRepositoryInterface/IReviewRepository";



export class ReviewRepository extends BaseRepository<ReviewDocument> implements IReviewRepository {
    constructor() {
        super(ReviewModel);
    }

    async findOne(courseID: Types.ObjectId): Promise<ReviewDocument | null> {
        try {
            return await this.model.findOne({ courseId: courseID }).populate('userReviews.userId');
        } catch (error) {
            throw error;
        }
    }

    async CountDocuments(): Promise<number> {
        try {
            return await this.model.countDocuments();
        } catch (error) {
            throw error
        }
    }

}