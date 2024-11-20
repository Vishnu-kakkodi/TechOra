import { BaseRepository } from "./base.repository";
import { CartModel } from "../models/cart.model";
import { CartDocument } from "../interfaces/cart.interface";


export class CartRepository extends BaseRepository<CartDocument>{
    constructor(){
        super(CartModel);
    }


    async findCart(userId: string | null): Promise<CartDocument[]>{
        try{
            return await this.model.find({
                userId: userId
            }).populate({
                path: 'items.course'
            })
        }catch(error){
            throw error
        }
    }

    async createCart(userId: string | null, items: any[], totalItems: number, totalPrice: number): Promise<CartDocument>{
        try{
            const newcart = new this.model({
                userId,
                items,
                totalItems,
                totalPrice
            });
            return await newcart.save();
        }catch(error){
            throw error
        }
    }

    async remove(userId: string | null, courseId: string | null): Promise<void>{
        try{
            console.log("Here")
             await this.model.updateOne(
                { userId: userId },
                { $pull: { items: { course: courseId } } }
            )
        }catch(error){
            throw error
        }
    }


}