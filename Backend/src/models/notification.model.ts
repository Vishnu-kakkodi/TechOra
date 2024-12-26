import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: string;
  message: string;
  readBy: string[];
  createdAt: Date;
  createdBy: string;
}

const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['QUIZ_CREATED', 'QUIZ_UPDATED', 'QUIZ_DELETED', 'COURSE_CREATED', 'COURSE_UPDATED']
  },
  message: {
    type: String,
    required: true
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
    ref: 'User'
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