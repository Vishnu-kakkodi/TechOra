import React from 'react';
import { useGetOrdersQuery } from '../../store/slices/userSlice';
import { Order } from '../../types/userSide/orderType';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const { data, isLoading, error } = useGetOrdersQuery(null);
  const orders = data?.order ?? [];  

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading orders</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4 text-gray-800">Order List</h1>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id} className="text-center hover:bg-gray-50">
                <td className="px-4 py-2 border">{order._id}</td>
                <td className="px-4 py-2 border">{order.transactionId}</td>
                <td className="px-4 py-2 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">₹{order.totalPrice.toFixed(2)}</td>
                <td
                  className={`px-4 py-2 border font-semibold ${
                    order.paymentStatus === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </td>
                <Link to={`/account/order-detail/${order._id}`}>
                <td className="px-4 py-2 border">View</td>
                </Link>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;