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
  console.log(wishlistData,"opop");



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
    try{
        const response:any = await removeWishlist({courseId}).unwrap();
        if(response){
            toast.success(response.message);
            refetch();
        }
    }
        catch(error: unknown){
            const ApiError = error as ApiError;
            toast.error(ApiError.data.message);
        }
  };

  return (
    <div className="p-6 min-height-screen mx-[30px] w-full">
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold mb-4">Favourate Courses</h1>

        {/* Search bar */}
        <div className="relative mb-6">
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
      <p className="text-lg font-medium">No courses in your wishlist yet.</p>
      <Link to="/course" className="mt-4 text-blue-500 hover:underline">
        Add Your Favourate Courses
      </Link>
    </div>
  ) : (
    wishlistItem.items.map((item:any) => (
        <div 
          key={item.course.id} 
          className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="flex-shrink-0">
            <img
              src={item.course.thumbnail}
              alt={item.course.title}
              className="w-24 h-24 object-cover"
            />
          </div>

          <div className="flex-grow space-y-2">
            <div className='ml-4'>
            <h3 className="text-lg font-semibold text-gray-800 truncate">
            Dept. of {item.course.department}
              </h3>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {item.course.title}
              </h3>
            </div>
            </div>

            <div className="flex items-center text-gray-600 space-x-4 ml-4">
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

          <div className="pr-4">
            <button onClick={()=>handleAddToCart(item.course._id)}>
            <ShoppingBag size={30} />
            </button>
          </div>
          <div className="pr-4">
            <button onClick={()=>handleRemove(item.course._id)}>
            <Trash2 size={30} />
            </button>
          </div>
        </div>
      ))
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

export default Wishlist;