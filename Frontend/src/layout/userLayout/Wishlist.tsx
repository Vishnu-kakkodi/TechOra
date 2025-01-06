



import React, { useEffect, useState } from 'react';
import { Search, Clock, Users, BookOpen, View, ShoppingBag, X, Trash2 } from 'lucide-react';
import { CourseDocument } from '../../types/courseType';
import { Link } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';
import { useAddToCartMutation, useRemoveWishlistMutation, useWishlistPageQuery } from '../../store/slices/userSlice';
import { ApiError } from '../../types/ApiError';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);
  const [addTocart] = useAddToCartMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  const {
    data: wishlistData,
    refetch
  } = useWishlistPageQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const wishlistItem = wishlistData?.favourates;
  const total = wishlistData?.total || 0;

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

  const handleAddToCart = async (courseId: string) => {
    try {
      const response: any = await addTocart({ courseId }).unwrap();
      if (response) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const ApiError = error as ApiError;
      toast.error(ApiError.data.message);
    }
  };

  const handleRemove = async (courseId: string) => {
    try {
      const response: any = await removeWishlist({ courseId }).unwrap();
      if (response) {
        toast.success(response.message);
        refetch();
      }
    } catch (error: unknown) {
      const ApiError = error as ApiError;
      toast.error(ApiError.data.message);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Favorite Courses</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        {!wishlistItem || !wishlistItem.items?.length ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
            <p className="text-lg font-medium text-center px-4">No courses in your wishlist yet.</p>
            <Link to="/course" className="mt-4 text-blue-500 hover:underline">
              Add Your Favorite Courses
            </Link>
          </div>
        ) : (
          wishlistItem.items.map((item: any) => (
            <div
              key={item.course.id}
              className="flex flex-col sm:flex-row items-start sm:items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                <img
                  src={item.course.thumbnail}
                  alt={item.course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow p-4 space-y-2 w-full">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  Dept. of {item.course.department}
                </h3>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                  {item.course.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    <span className="text-sm">{item.course.duration} Weeks</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-green-500 font-medium">
                      Start Date: {item.course.startDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-4 p-4 sm:pr-4">
                <button
                  onClick={() => handleAddToCart(item.course._id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={24} />
                </button>
                <button
                  onClick={() => handleRemove(item.course._id)}
                  className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {wishlistItem && wishlistItem.items?.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              className="px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md"
            >
              {page}
            </button>
            <button
              onClick={handleNextPage}
              disabled={page * limit >= total}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;