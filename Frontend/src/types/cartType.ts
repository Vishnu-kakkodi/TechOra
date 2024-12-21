
export interface CartItem {
    course: {
        _id: string;
        title: string;
        department: string;
        duration: string;
        description: string;
        startDate: string;
        price: number;
        status: string;
        thumbnail: string;
        totalModules: number;
        totalDuration: number;
        modules: {
            title: string;
            description: string;
            duration: number;
            video: string;
            status: string;
            _id: string;
            createdAt: string;
            updatedAt: string;
        }[];
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    price: number;
    subTotal: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface cartResponse {
    message: string;
    Data: {
        _id: string;
        userId: string;
        items: CartItem[];
        totalItems: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
    }
}
