export interface orderItems{
    courseId: string[]
  }

  interface Module {
    _id: string;
    title: string;
    description: string;
    duration: number;
    video: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Course {
    _id: string;
    title: string;
    department: string;
    instructor: string;
    duration: string;
    description: string;
    startDate: string;
    price: number;
    status: string;
    thumbnail: string;
    institutionId: string;
    totalModules: number;
    totalDuration: number;
    modules: Module[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface OrderItem {
    course: Course;
    price: number;
    subTotal: number;
    _id: string;
  }
  
  export interface Order {
    _id: string;
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalItems: number;
    totalPrice: number;
    paymentStatus: 'Pending' | 'Completed';
    paymentMethod: string;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface OrderResponse {
    order: Order[];
  }