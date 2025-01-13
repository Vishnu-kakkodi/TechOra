
import { WishlistDocument } from "../../type/wishlist.type";



export interface IWishlistService{

    addToWishlist(userId: string | null, courseId: string): Promise<string>
    wishlistPage(userId: string | null, page:number,limit:number,search:string): Promise<{favourates: WishlistDocument | null; total: number}>
    removeWishlist(userId:string, courseId:string): Promise<string>
}