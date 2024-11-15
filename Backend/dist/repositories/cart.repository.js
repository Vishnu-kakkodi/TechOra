"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const base_repository_1 = require("./base.repository");
const cart_model_1 = require("../models/cart.model");
class CartRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(cart_model_1.CartModel);
    }
    async findCart(userId) {
        try {
            return await this.model.find({
                userId: userId
            }).populate({
                path: 'items.course'
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cart.repository.js.map