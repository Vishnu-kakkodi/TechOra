
import React, { useState } from 'react';
import { useGetOrdersQuery } from '../../store/slices/userSlice';
import { Order } from '../../types/userSide/orderType';
import { Link } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const {
    data: responseData,
    isLoading,
    isError
  } = useGetOrdersQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-600">Error fetching order data.</div>
      </div>
    );
  }

  const orders = responseData?.data?.orders || [];
  const total = responseData?.data?.total || 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {!orders || !orders?.length ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
            <p className="text-lg font-medium">No orders found.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Order List</h1>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Payment Type</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">View</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => (
                    <tr key={order._id} className="text-center hover:bg-gray-50">
                      <td className="px-4 py-2 border">{order.orderId}</td>
                      <td className="px-4 py-2 border">{order.paymentMethod}</td>
                      <td className="px-4 py-2 border">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">₹{order.totalPrice.toFixed(2)}</td>
                      <td className={`px-4 py-2 border font-semibold ${
                        order.paymentStatus === "Completed" ? "text-green-600" : "text-red-600"
                      }`}>
                        {order.paymentStatus}
                      </td>
                      <td className="px-4 py-2 border">
                        <Link
                          to={`/account/order-detail/${order._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order: Order) => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order ID:</span>
                    <span>{order.orderId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Transaction:</span>
                    <span className="text-sm">{order.transactionId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Price:</span>
                    <span>₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Status:</span>
                    <span className={`font-semibold ${
                      order.paymentStatus === "Completed" ? "text-green-600" : "text-red-600"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <Link
                    to={`/account/order-detail/${order._id}`}
                    className="block text-center mt-3 text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 w-full sm:w-auto text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md">
              {page}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page * limit >= total}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;