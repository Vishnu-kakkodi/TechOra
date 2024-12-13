export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    type: 'text' | 'file';
  }
  
  export interface ChatSession {
    id: string;
    studentId: string;
    studentName: string;
    tutorId: string;
    createdAt: number;
    lastMessageAt: number;
    messages: ChatMessage[];
    status: 'active' | 'archived' | 'closed';
  }