import { BaseRepository } from "./base.repository";
import { CartModel } from "../models/cart.model";
import { CourseModel } from "../models/course.model";
import { CartDocument } from "../interfaces/cart.interface";


export class CartRepository extends BaseRepository<CartDocument>{
    constructor(){
        super(CartModel);
    }


    async findCart(userId: string): Promise<CartDocument[]>{
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

    async createCart(userId: string, items: any[], totalItems: number, totalPrice: number): Promise<CartDocument>{
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


}