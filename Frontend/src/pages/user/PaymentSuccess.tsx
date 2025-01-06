

import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePaymentSuccessMutation } from '../../store/slices/userSlice';
import { CheckCircleIcon } from 'lucide-react';
import { OrderResponse } from 'src/types/userSide/orderType';

interface CourseItem {
    course: {
        _id: string;
        title: string;
        thumbnail: string;
        instructor: string;
    };
    price: number;
    subTotal: number;
}

interface OrderDetails {
    order: {
        _id: string;
        orderId: string;
        userId: string;
        items: CourseItem[];
        totalItems: number;
        totalPrice: number;
        paymentStatus: string;
        paymentMethod: string;
        transactionId?: string;
        createdAt?: Date;
    }
}

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState<any | null>(null);
    const [paymentSuccess] = usePaymentSuccessMutation();

    useEffect(() => {
        const updateOrderPaymentStatus = async () => {
            if (orderId) {
                try {
                    const orderResponse = await paymentSuccess(orderId);
                    const Data = orderResponse?.data?.data
                    setOrderDetails(Data);
                } catch (err) {
                    console.error('Error updating payment status:', err);
                }
            }
        };

        updateOrderPaymentStatus();
    }, [orderId, paymentSuccess]);


    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-500">No order ID found.</p>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-600">Loading order details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful</h1>
                    <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600">Order ID: 
                                <span className="font-semibold ml-2 text-gray-900">{orderDetails?.orderId}</span>
                            </p>
                            <p className="text-gray-600 mt-2">Payment Method: 
                                <span className="font-semibold ml-2 text-gray-900">{orderDetails?.paymentMethod}</span>
                            </p>
                            <p className="text-gray-600 mt-2">Total Items: 
                                <span className="font-semibold ml-2 text-gray-900">{orderDetails?.totalItems}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">Total: ₹{orderDetails?.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchased Courses</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {orderDetails?.items?.map((item:any) => (
                                <div 
                                    key={item?.course._id} 
                                    className="bg-gray-50 rounded-lg overflow-hidden shadow-md flex"
                                >
                                    <img 
                                        src={item?.course?.thumbnail} 
                                        alt={item?.course?.title} 
                                        className="w-32 h-24 object-cover"
                                    />
                                    <div className="p-4 flex-grow">
                                        <h4 className="font-bold text-gray-900">{item?.course?.title}</h4>
                                        <p className="text-gray-800 font-semibold mt-2">
                                            ₹ {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => window.location.href = '/course'}
                    >
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
