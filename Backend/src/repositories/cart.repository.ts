import { BaseRepository } from "./base.repository";
import { CartModel } from "../models/cart.model";
import { CartDocument } from "../type/cart.type";
import mongoose from 'mongoose';



export class CartRepository extends BaseRepository<CartDocument> {
    constructor() {
        super(CartModel);
    }


    async findCart(userId: string | null): Promise<CartDocument | null> {
        try {
            return await this.model.findOne({
                userId: userId
            }).populate({
                path: 'items.course'
            })
        } catch (error) {
            throw error
        }
    }

    async createCart(userId: string | null, items: any[], totalItems: number, totalPrice: number): Promise<CartDocument> {
        try {
            const newcart = new this.model({
                userId,
                items,
                totalItems,
                totalPrice
            });
            return await newcart.save();
        } catch (error) {
            throw error
        }
    }

    async remove(userId: string | null, courseId: string | null): Promise<void> {
        try {
            await this.model.updateOne(
                { userId: userId },
                { $pull: { items: { course: courseId } } }
            )
        } catch (error) {
            throw error
        }
    }

    async findOneAndUpdate(userId: string | number, courseIds: mongoose.Types.ObjectId[] | undefined) {
        try {
            const mongoUserId = new mongoose.Types.ObjectId(userId);
            const updatedCart = await this.model.findOneAndUpdate(
                { userId: mongoUserId },
                {
                    $pull: {
                        items: { course: { $in: courseIds } }
                    }
                },
                { new: true }
            ).populate('items.course');

            if (updatedCart) {
                updatedCart.totalItems = updatedCart.items.length;
                updatedCart.totalPrice = updatedCart.items.reduce((total, item) => total + item.price, 0);
                await updatedCart.save();
            }

        } catch (error) {
            throw error
        }
    }


}