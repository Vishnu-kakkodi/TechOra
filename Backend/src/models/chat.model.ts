import {Schema, model} from 'mongoose'
import { ReviewDocument } from '../interfaces/review.interface';
import { ChatDocument } from '../interfaces/chat.interface';

const chatSchema = new Schema<ChatDocument>(
    {
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            receiverId: {
                type: Schema.Types.ObjectId,
                ref: 'Tutor',
                required: true
            },
            text: {
                type: String,
                required:true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
    },

    {
        timestamps: true
    }
    
)

export const ChatModel =  model<ChatDocument>('Review',chatSchema);