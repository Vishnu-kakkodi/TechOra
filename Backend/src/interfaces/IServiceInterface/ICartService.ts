
import { CartDocument } from "../../type/cart.type";



export interface ICartService{

    addToCart(userId: string | null, courseId: string): Promise<any>
    getCartItems(userId: string | null): Promise<CartDocument | null>
    removeCart(userId: string | null, courseId: string): Promise<void>
}