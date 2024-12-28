"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const base_repository_1 = require("./base.repository");
const cart_model_1 = require("../models/cart.model");
const mongoose_1 = __importDefault(require("mongoose"));
class CartRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(cart_model_1.CartModel);
    }
    async findCart(userId) {
        try {
            return await this.model.findOne({
                userId: userId
            }).populate({
                path: 'items.course'
            });
        }
        catch (error) {
            throw error;
        }
    }
    async createCart(userId, items, totalItems, totalPrice) {
        try {
            const newcart = new this.model({
                userId,
                items,
                totalItems,
                totalPrice
            });
            return await newcart.save();
        }
        catch (error) {
            throw error;
        }
    }
    async remove(userId, courseId) {
        try {
            await this.model.updateOne({ userId: userId }, { $pull: { items: { course: courseId } } });
        }
        catch (error) {
            throw error;
        }
    }
    async findOneAndUpdate(userId, courseIds) {
        try {
            const mongoUserId = new mongoose_1.default.Types.ObjectId(userId);
            const updatedCart = await this.model.findOneAndUpdate({ userId: mongoUserId }, {
                $pull: {
                    items: { course: { $in: courseIds } }
                }
            }, { new: true }).populate('items.course');
            if (updatedCart) {
                updatedCart.totalItems = updatedCart.items.length;
                updatedCart.totalPrice = updatedCart.items.reduce((total, item) => total + item.price, 0);
                await updatedCart.save();
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cart.repository.js.map