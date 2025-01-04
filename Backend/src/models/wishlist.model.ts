import {Schema,model} from 'mongoose';
import { WishlistDocument } from '../type/wishlist.type';

const wishlistSchema = new Schema<WishlistDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items:[
            {
            course: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }
    ]

    },
    {timestamps: true}
)

export const WishlistModel = model('Wishlist',wishlistSchema);