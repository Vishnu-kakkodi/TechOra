interface Message {
  id: string;                  
  senderId: string;            
  sender?: {                   
    id: string;
    name: string;
    avatar?: string;
  };
  receiverId: string;          
  text: string;                
  type: 'text' | 'file' | 'image'; 
  timestamp: number;           
  status: 'sending' | 'sent' | 'delivered' | 'read'; 
}