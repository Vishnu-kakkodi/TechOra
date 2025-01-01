// import React, { useState } from 'react';
// import { Search, Clock, Users, BookOpen, View } from 'lucide-react';
// import { useMyCoursesQuery } from '../../store/slices/userSlice';
// import { CourseDocument } from '../../types/courseType';
// import { Link } from 'react-router-dom';
// import useDebouncedValue from '../../hooks/debounceHook';

// const MyCourses = () => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(3);
//   const [search, setSearch] = useState("");
//   const debouncedSearchTerm = useDebouncedValue(search, 500);

//   const {
//     data: courseData,
//     isLoading,
//     isError
//   } = useMyCoursesQuery({
//     page,
//     limit,
//     search: debouncedSearchTerm,
//   });
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error fetching course data.</div>;
//   }

//   const courses = courseData?.data || [];
//   const total = courseData?.total || 0;

//   console.log(courseData?.data)

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setPage(1);
//     setSearch(value);
//   };


//   const handleNextPage = () => {
//     if (page * limit < total) {
//       setPage(page + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   return (
//     <div className="p-6 min-height-screen mx-[30px] w-full">
//       {!courses || !courses?.length ? (
//         <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
//           <p className="text-lg font-medium">No courses available.</p>
//         </div>
//       ) : (
//         <>
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold mb-4">My Courses</h1>

//             {/* Search Bar */}
//             <div className="relative mb-6">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={search}
//                 onChange={handleSearchChange}
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             {courses.map((course: CourseDocument) => (
//               <div
//                 key={course.id}
//                 className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
//               >
//                 <div className="flex-shrink-0">
//                   <img
//                     src={course.thumbnail}
//                     alt={course.title}
//                     className="w-24 h-24 object-cover"
//                   />
//                 </div>

//                 <div className="flex-grow space-y-2 ml-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 truncate">
//                       Dept. of {course.department}
//                     </h3>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold text-gray-800 truncate">
//                         {course.title}
//                       </h3>
//                     </div>
//                   </div>

//                   <div className="flex items-center text-gray-600 space-x-4">
//                     <div className="flex items-center">
//                       <Clock className="mr-2 text-blue-500" size={16} />
//                       <span className="text-sm">{course.duration} Weeks</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm text-green-500 font-medium">
//                         Start Date: {course.startDate}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* View Course Action */}
//                 <div className="pr-4">
//                   <Link
//                     to={`/course-view/${course._id}`}
//                     className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
//                   >
//                     <span className="text-blue-500 hover:underline">View</span>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
//         <div className="flex flex-1 justify-between sm:hidden">
//           <button
//             onClick={handlePreviousPage}
//             disabled={page === 1}
//             className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNextPage}
//             disabled={page * limit >= total}
//             className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing{' '}
//               <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
//               to{' '}
//               <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
//               of{' '}
//               <span className="font-medium">{total}</span>{' '}
//               results
//             </p>
//           </div>
//           <div>
//             <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={page === 1}
//                 className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
//                 {page}
//               </button>
//               <button
//                 onClick={handleNextPage}
//                 disabled={page * limit >= total}
//                 className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCourses;



import React, { useState } from 'react';
import { Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMyCoursesQuery } from '../../store/slices/userSlice';
import { CourseDocument } from '../../types/courseType';
import { Link } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';

const MyCourses = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const {
    data: courseData,
    isLoading,
    isError
  } = useMyCoursesQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-red-600">Error fetching course data.</div>
      </div>
    );
  }

  const courses = courseData?.data || [];
  const total = courseData?.total || 0;

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
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
      {!courses || !courses?.length ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <p className="text-lg font-medium">No courses available.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Courses</h1>
              <div className="relative w-full sm:w-64">
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
          </div>

          <div className="space-y-4">
            {courses.map((course: CourseDocument) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row items-start sm:items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow p-4 sm:ml-4 space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600">
                      Dept. of {course.department}
                    </h3>
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {course.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-500" size={16} />
                      <span className="text-sm">{course.duration} Weeks</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-500 font-medium">
                        Start Date: {course.startDate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 sm:hidden">
                    <Link
                      to={`/course-view/${course._id}`}
                      className="inline-block w-full text-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View Course
                    </Link>
                  </div>
                </div>

                <div className="hidden sm:block pr-4">
                  <Link
                    to={`/course-view/${course._id}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
              </div>
              
              <div className="flex justify-center items-center gap-2">
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
        </>
      )}
    </div>
  );
};

export default MyCourses;