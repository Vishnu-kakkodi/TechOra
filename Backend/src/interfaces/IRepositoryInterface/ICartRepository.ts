import { CartDocument } from "../../type/cart.type";


export interface ICartRepository{

findCart(userId: string | null): Promise<CartDocument | null>
    
}