import { CourseRepository } from "../repositories/course.repository";
import mongoose from "mongoose";
import { ReviewRepository } from "../repositories/review.repository";
import { ReviewDocument } from "../type/review.type";
import { IReviewService } from "../interfaces/IServiceInterface/IReviewService";


class ReviewService implements IReviewService {
    private reviewRepository: ReviewRepository;
    private courseRepository: CourseRepository;


    constructor(reviewRepository: ReviewRepository, courseRepository: CourseRepository) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;

    }

    async createReview(rating: number, comment: string, userId: string, courseId: string): Promise<void> {
        try {
            const userID = new mongoose.Types.ObjectId(userId);
            const courseID = new mongoose.Types.ObjectId(courseId);

            let reviewDoc = await this.reviewRepository.findOne(courseID);
            const course = await this.courseRepository.findById(courseId)
            if (reviewDoc) {
                reviewDoc.userReviews.push({
                    userId: userID,
                    comment,
                    rating,
                });

                const totalRatings = reviewDoc.userReviews.reduce((acc: any, review: any) => acc + review.rating, 0);
                reviewDoc.averageRating = totalRatings / reviewDoc.userReviews.length;

                if(course){
                    course.averageRating = totalRatings / reviewDoc.userReviews.length;
                    course.totalReviews = reviewDoc.userReviews.length;
                    await course.save();
                }
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

                if(course){
                    course.averageRating = rating;
                    course.totalReviews = 1;
                    await course.save();
                }

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

export default ReviewService;


