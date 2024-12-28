"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRepository = void 0;
const base_repository_1 = require("./base.repository");
const wishlist_model_1 = require("../models/wishlist.model");
const mongoose_1 = __importDefault(require("mongoose"));
class WishlistRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(wishlist_model_1.WishlistModel);
    }
    async find(userId) {
        try {
            return await this.model.findOne({
                userId: userId
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findFavourates(userId, searchQuery, skip, limit) {
        try {
            const query = {
                userId,
                ...searchQuery
            };
            const favourates = await this.model
                .findOne(query)
                .skip(skip)
                .limit(limit)
                .populate('items.course');
            const total = await this.model.countDocuments(query);
            return { favourates, total };
        }
        catch (error) {
            throw error;
        }
    }
    async removeWishlist(userId, courseId) {
        try {
            const result = await this.model.updateOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }, { $pull: { items: { course: new mongoose_1.default.Types.ObjectId(courseId) } } });
            const res = await this.model.find({ userId: userId });
            if (result.modifiedCount === 0) {
                return 'No item was removed. Ensure the itemId and userId are correct.';
            }
            else {
                return 'Item successfully removed';
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.WishlistRepository = WishlistRepository;
//# sourceMappingURL=wishlist.repository.js.map