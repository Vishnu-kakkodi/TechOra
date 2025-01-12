import { BaseRepository } from "./base.repository";
import { WishlistModel } from "../models/wishlist.model";
import { WishlistDocument } from "../type/wishlist.type";
import mongoose, { FilterQuery } from "mongoose";
import { IWishlistRepository } from "../interfaces/IRepositoryInterface/IWishlistRepository";

export type SearchCourse = FilterQuery<{
    title: string;
    department: string;
    instructor: string;
}>;

export class WishlistRepository extends BaseRepository<WishlistDocument> implements IWishlistRepository {
    constructor() {
        super(WishlistModel)
    }

    async find(userId: string | null): Promise<WishlistDocument | null> {
        try {
            return await this.model.findOne({
                userId: userId
            })
        } catch (error) {
            throw error
        }
    }

    async findFavourates(
        userId: string | null,
        searchQuery: SearchCourse,
        skip: number,
        limit: number
    ): Promise<{ favourates: WishlistDocument | null; total: number }> {
        try {
            const query = {
                userId,
                ...searchQuery
            }

            const favourates = await this.model
                .findOne(query)
                .skip(skip)
                .limit(limit)
                .populate('items.course');
            const total = await this.model.countDocuments(query);

            return { favourates, total };
        } catch (error) {
            throw error
        }
    }

    async removeWishlist(
        userId: string,
        courseId: string
    ): Promise<any>{
        try{
            const result =  await this.model.updateOne(
                {userId:new mongoose.Types.ObjectId(userId)},
                {$pull:{items:{course:new mongoose.Types.ObjectId(courseId)}}}
            );

            const res = await this.model.find({userId:userId});

            if (result.modifiedCount === 0) {
                return 'No item was removed. Ensure the itemId and userId are correct.'
            } else {
                return 'Item successfully removed'
            }
        }catch(error){
            throw error;
        }
    }
}