import { ReviewDocument } from "../../type/review.type";



export interface IReviewService{
    createReview(rating: number, comment: string, userId: string, courseId: string): Promise<void>
    Review(courseId: string): Promise<{ response: ReviewDocument | null; total: number | undefined }>
}