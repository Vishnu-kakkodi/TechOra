import {Schema, model} from 'mongoose'
import { ReviewDocument } from '../type/review.type';

const reviewSchema = new Schema<ReviewDocument>(
    {
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
        userReviews:[{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                required:true
            },
            rating: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        averageRating: {
            type: Number,
            required: false
        }

    },

    {
        timestamps: true
    }
    
)

export const ReviewModel =  model<ReviewDocument>('Review',reviewSchema);