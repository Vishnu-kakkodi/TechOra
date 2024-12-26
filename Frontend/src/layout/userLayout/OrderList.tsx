import React, { useState } from 'react';
import { useGetOrdersQuery } from '../../store/slices/userSlice';
import { Order } from '../../types/userSide/orderType';
import { Link } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';
import { Search } from 'lucide-react';

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);


  const {
    data: order,
    isLoading,
    isError
  } = useGetOrdersQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching course data.</div>;
  }
  console.log(order);
  const orders = order?.orders || [];
  const total = order?.total || 0;


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPage(1);
    setSearch(value);
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
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="bg-white rounded-lg shadow-md p-6">
      {!orders || !orders?.length ? (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
    <p className="text-lg font-medium">No orders.</p>
  </div>
) : (
  <>
    <h1 className="text-xl font-bold mb-4 text-gray-800">Order List</h1>
    <div className="relative mb-6 w-fit">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={handleSearchChange}
      />
    </div>
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
            <td className="px-4 py-2 border">{order.orderId}</td>
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
  </>
)}

      </div>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page * limit >= total}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
              to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
              of{' '}
              <span className="font-medium">{total}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                {page}
              </button>
              <button
                onClick={handleNextPage}
                disabled={page * limit >= total}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;