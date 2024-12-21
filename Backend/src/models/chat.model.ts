import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  currentUserType: {
    type: String,
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  roomId: {
    type: String,
    required: true
  },
  isRead: {
    type: String,
    required: true,
    default: false
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read'],
    default: 'pending'
  }
});

export default mongoose.model('Message', MessageSchema);