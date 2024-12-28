"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistModel = void 0;
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            course: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }
    ]
}, { timestamps: true });
exports.WishlistModel = (0, mongoose_1.model)('Wishlist', wishlistSchema);
//# sourceMappingURL=wishlist.model.js.map