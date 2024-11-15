import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { useCartPageQuery, usePaymentMutation } from '../../store/slices/userSlice';
import { CartItem } from '../../types/cartType';

interface UserCartProps {
  onRemoveItem?: (id: string) => void;
  onCheckout?: (selectedItems: CartItem[] | undefined) => void;
}

const UserCart: React.FC<UserCartProps> = ({ onRemoveItem, onCheckout }) => {

  const { data: cartData, isLoading, isError } = useCartPageQuery(null);
  const cartItems = cartData?.Data[0];
  console.log(cartItems?.items[0].course, "Cartdata");

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [payment] = usePaymentMutation();

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

  const selectedItemsDetails: CartItem[] = cartItems?.items.filter(item => selectedItems.has(item.course._id)) ?? [];
  const total = selectedItemsDetails.length > 0 
    ? selectedItemsDetails.reduce((sum, item) => sum + item.price, 0) 
    : 0;

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
    onRemoveItem?.(id);
  };

  const handleCheckout = async () => {
    onCheckout?.(selectedItemsDetails); 
    // const response = await payment()
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems?.items.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Select All Items</span>
                </label>
              </div>

              {cartItems?.items.map((item) => (
                <div
                  key={item.course._id}
                  className="bg-white rounded-lg shadow-sm mb-4 hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.course._id)}
                        onChange={() => handleItemSelect(item.course._id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>

                    <div className="w-full md:w-24 h-16">
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{item.course.title}</h3>
                          <p className="text-gray-600 mt-1">by {item.course.instructor}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              Duration: {item.course.duration}
                            </p>
                            <p className="text-sm text-gray-500">
                              Department: {item.course.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{item.price.toFixed(2)}</p>
                          <button
                            className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                            onClick={() => handleRemoveItem(item.course._id)}
                            aria-label={`Remove ${item.course.title} from cart`}
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {selectedItemsDetails.length > 0 ? (
                    <>
                      {selectedItemsDetails?.map((item) => (
                        <div key={item.course._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.course.title}</span>
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
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Secure checkout powered by Stripe
                      </p>
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

          {cartItems?.items.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">Browse our courses to add items to your cart</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserCart;
