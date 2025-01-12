import { ReviewDocument } from "../../type/review.type";
import { IBaseRepository } from "./IBaseRepository";
import { Types } from 'mongoose';


export interface IReviewRepository extends IBaseRepository<ReviewDocument>{
findOne(courseID: Types.ObjectId): Promise<ReviewDocument | null>
CountDocuments(): Promise<number>
}