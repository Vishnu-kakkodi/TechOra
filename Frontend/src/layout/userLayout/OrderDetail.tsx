import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../store/slices/userSlice';
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../../types/userSide/orderType';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import { usePaymentMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';




const OrderDetail = () => {
    const [loading, setLoading] = useState(true);
    const [visibleCourses, setVisibleCourses] = useState(2); 
    const [showAll, setShowAll] = useState(false);
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { data: orderData, isLoading } = useGetOrdersQuery(null);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [payment] = usePaymentMutation();


    useEffect(() => {
        if (orderId && orderData?.order) {
            const found = orderData.order.find((order) => order._id === orderId);
            if (found) {
                setCurrentOrder(found);
            }
            setLoading(false);
        }
    }, [orderData, orderId]);

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">Order not found</div>
            </div>
        );
    }
    const orderItems = currentOrder.items.map((item) => ({
        courseId: item.course._id,
        name: item.course.title,
        description: item.course.description,
        thumbnail: item.course.thumbnail,
        price: item.price,
        subTotal: item.subTotal
    }));

    const total = currentOrder.totalPrice
  
    console.log(orderItems)
  
    const orderDetails = {
      orderId,
      orderItems,
      total
    }

    const handleContinuePayment = async () => {
        const stripe = await loadStripe("pk_test_51QNDQKGEFHCzggCSwTwIr16xAKbs3fvWWrDx2gIHy97ldM7yvXRv1Br5AEd2RI4xhEkVBrrfW2f7ZtBziCqbDsS300AGTVPbgi");
        if (!stripe) {
          console.error('Stripe failed to load');
          return;
        }
      
        try {
          console.log(orderDetails,"Details")
          const response = await payment({orderDetails});
          
          if (response.data && response.data.id) {
            const result = await stripe.redirectToCheckout({
              sessionId: response.data.id
            });
      
            if (result.error) {
              console.error('Checkout Error:', result.error);
              toast.error('Checkout failed');
            }
          } else {
            toast.error('Failed to create checkout session');
          }
        } catch (error) {
          console.error('Checkout Process Error:', error);
          toast.error('An error occurred during checkout');
        }
      };
    

    const getStatusIcon = (status: 'Pending' | 'Completed') => {
        if (status === "Completed") return <CheckCircle className="w-6 h-6 text-green-500" />;
        if (status === "Pending") return <Clock className="w-6 h-6 text-yellow-500" />;
        return <AlertCircle className="w-6 h-6 text-red-500" />;
    };

    const toggleViewMore = () => {
        if (showAll) {
            setVisibleCourses(2);
            setShowAll(false);
        } else {
            setVisibleCourses(currentOrder.items.length);
            setShowAll(true);
        }
    };

    const displayedCourses = currentOrder.items.slice(0, visibleCourses);

    return (
        <div className="p-4 bg-gray-100 min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Order Details</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-medium">{currentOrder._id}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Transaction ID</p>
                                <p className="font-medium">{currentOrder.transactionId || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Order Date</p>
                                <p className="font-medium">
                                    {new Date(currentOrder.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-medium">₹{currentOrder.totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-medium">{currentOrder.paymentMethod}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Total Items</p>
                                <p className="font-medium">{currentOrder.totalItems}</p>
                            </div>
                            
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(currentOrder.paymentStatus)}
                                        <span className="font-medium">
                                            Payment Status: {currentOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                {currentOrder.paymentStatus === "Pending" && (
                                    <button 
                                        onClick={handleContinuePayment}
                                        className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            Purchased Courses ({currentOrder.items.length})
                        </h2>
                        <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                            {displayedCourses.map((item) => (
                                <div
                                    key={item._id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{item.course.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.course.description}
                                            </p>
                                            <div className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-2">
                                                <p>Instructor: {item.course.instructor}</p>
                                                <p>Department: {item.course.department}</p>
                                                <p>Duration: {item.course.duration} Weeks</p>
                                                <p>Total Modules: {item.course.totalModules}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                                            <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">
                                                Subtotal: ₹{item.subTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {currentOrder.items.length > 2 && (
                            <button
                                onClick={toggleViewMore}
                                className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                {showAll ? (
                                    <>
                                        View Less <ChevronUp className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        View More ({currentOrder.items.length - visibleCourses} more courses) <ChevronDown className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;