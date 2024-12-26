import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { useCartPageQuery, usePaymentMutation, useRemoveCartMutation } from '../../store/slices/userSlice';
import { CartItem } from '../../types/cartType';
import { toast } from 'react-toastify';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import { orderItems } from '../../types/userSide/orderType';

interface UserCartProps {
  onRemoveItem?: (id: string) => void;
  onCheckout?: (selectedItems: CartItem[] | undefined) => void;
}

const UserCart: React.FC<UserCartProps> = ({ onRemoveItem, onCheckout }) => {
  const { data: cartData, refetch  } = useCartPageQuery(null);
  const cartItems = cartData?.Data;
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [payment] = usePaymentMutation();
  const [removecart] = useRemoveCartMutation();

  console.log(cartData,"cartItemsss")

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleItemSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(new Set(cartItems?.items.map((item) => item.course._id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const selectedItemsDetails: CartItem[] = cartItems?.items.filter(item => selectedItems.has(item.course?._id)) ?? [];
  console.log(selectedItemsDetails)
  const total = selectedItemsDetails.length > 0 
    ? selectedItemsDetails.reduce((sum, item) => sum + item.price, 0) 
    : 0;

    const orderItems = selectedItemsDetails.map((item) => ({
      courseId: item.course._id.toString(),
      name: item.course.title,
      description: item.course.description,
      thumbnail:item.course.thumbnail,
      price: item.price
  }));

  const orderDetails = {
    orderItems,
    total
  }

  const handleRemoveItem = async (id: string) => {

    const res = await removecart({courseId:id}).unwrap();
    if(res){
      toast.success("Course removed");
      refetch();
    }
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
    onRemoveItem?.(id);
  };

  const handleCheckout = async () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-6 mb-6 sm:mb-8">Shopping Cart</h1>
      {!cartItems || !cartItems?.items.length ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <p className="text-lg font-medium">Your Cart is Emppty.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-3">Order Summary</h2>
              {selectedItemsDetails.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {selectedItemsDetails.map((item) => (
                      <div key={item.course._id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate mr-2">{item.course.title}</span>
                        <span className="font-medium">{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Checkout Now
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-center py-2">Select items to see total</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems?.items.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Select All</span>
                </label>
              </div>

              <div className="space-y-4">
                {cartItems?.items.map((item) => (
                  <div
                    key={item.course._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.course._id)}
                          onChange={() => handleItemSelect(item.course._id)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.course.thumbnail}
                            alt={item.course.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                              <h3 className="text-lg font-semibold truncate">{item.course.title}</h3>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end">
                              <div className="text-lg font-bold">{item.price.toFixed(2)}</div>
                              <button
                                onClick={() => handleRemoveItem(item.course._id)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1 sm:mt-2"
                              >
                                <Trash2 size={16} />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 sm:flex sm:gap-4 text-sm text-gray-500">
                            <span>Duration: {item.course.duration}</span>
                            <span>Department: {item.course.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cartItems?.items.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
                  <p className="text-gray-500 mt-2">Add courses to your cart</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {selectedItemsDetails.length > 0 ? (
                    <>
                      {selectedItemsDetails.map((item) => (
                        <div key={item.course._id} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate mr-2">{item.course.title}</span>
                          <span>{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{total.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Select items to see order summary
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default UserCart;