import { HttpException } from "../middleware/error.middleware";
import { CreateCourseDto } from "../dtos/course.dtos";
import { CourseRepository } from "../repositories/course.repository";
import { Course, CourseDocument, Module } from "../interfaces/course.interface";
import { CartDocument } from "../interfaces/cart.interface";
import { CartRepository } from "../repositories/cart.repository";
import mongoose from "mongoose";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ReviewRepository } from "../repositories/review.repository";
import { ReviewDocument } from "../interfaces/review.interface";


export class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor(reviewRepository: ReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async createReview(rating: number, comment: string, userId: string, courseId: string): Promise<void> {
        try {
            const userID = new mongoose.Types.ObjectId(userId);
            const courseID = new mongoose.Types.ObjectId(courseId);

            let reviewDoc = await this.reviewRepository.findOne(courseID);

            if (reviewDoc) {
                reviewDoc.userReviews.push({
                    userId: userID,
                    comment,
                    rating,
                });

                const totalRatings = reviewDoc.userReviews.reduce((acc: any, review: any) => acc + review.rating, 0);
                reviewDoc.averageRating = totalRatings / reviewDoc.userReviews.length;

                await reviewDoc.save();
            } else {
                const reviewData = {
                    courseId: courseID,
                    userReviews: [
                        {
                            userId: userID,
                            comment,
                            rating,
                        },
                    ],
                    averageRating: rating,
                };

                await this.reviewRepository.create(reviewData);
            }
        } catch (error) {
            throw error;
        }
    }

    async Review(courseId: string): Promise<{ response: ReviewDocument | null; total: number | undefined }> {
        try {
            const courseID = new mongoose.Types.ObjectId(courseId);
            const response = await this.reviewRepository.findOne(courseID);
    
            const total = response?.userReviews.length;
    
            return { response, total };
        } catch (error) {
            throw error;
        }
    }
    


}


