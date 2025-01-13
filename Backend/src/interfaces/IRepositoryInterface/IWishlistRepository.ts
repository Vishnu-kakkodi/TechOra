import { FilterQuery } from "mongoose";
import { WishlistDocument } from "../../type/wishlist.type";
import { IBaseRepository } from "./IBaseRepository";

export type SearchCourse = FilterQuery<{
    title: string;
    department: string;
    instructor: string;
}>;

export interface IWishlistRepository extends IBaseRepository<WishlistDocument> {
    find(userId: string | null): Promise<WishlistDocument | null>
    findFavourates(
        userId: string | null,
        searchQuery: SearchCourse,
        skip: number,
        limit: number
    ): Promise<{ favourates: WishlistDocument | null; total: number }>
    removeWishlist(
        userId: string,
        courseId: string
    ): Promise<string>
}