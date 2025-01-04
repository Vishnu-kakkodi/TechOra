import mongoose, { Schema, Document, Types } from 'mongoose';
import { INotification } from '../type/notification.type';



const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['QUIZ_CREATED', 'QUIZ_UPDATED', 'QUIZ_DELETED', 'COURSE_CREATED', 'COURSE_UPDATED']
  },
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);