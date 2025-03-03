import React, { useEffect, useState } from 'react';
import {
  Pencil,
  UserX,
  UserCog,
  Search,
  ChevronDown
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useUserListQuery, useUserActionMutation } from '../../store/slices/adminSlice';
import { toast } from 'react-toastify';
import useDebouncedValue from '../../hooks/debounceHook';
import { IUserDocument } from '../../types/userSide/leaderBoard';

const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4); 
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('');
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const {
    data: data,
    isLoading,
    error,
    refetch
  } = useUserListQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    filter
  });

  const userdata = data?.users;
  const total = data?.total || 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filter]);
  const [userAction] = useUserActionMutation();

  const handleUserStatusChange = async (user: IUserDocument) => {
    const isBlocking = user.status === 'active';
    const action = isBlocking ? 'block' : 'unblock';

    try {
      const result = await Swal.fire({
        title: `${isBlocking ? 'Block' : 'Unblock'} User`,
        text: `Are you sure you want to ${action} ${user.userName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: isBlocking ? '#d33' : '#3085d6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: isBlocking ? 'Yes, block user' : 'Yes, unblock user',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'font-sans'
        }
      });

      if (result.isConfirmed) {
        const userId:any = user._id
        const response = await userAction(userId).unwrap();

        if (response) {
          Swal.fire({
            title: 'Success!',
            text: `User has been ${action}ed successfully`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            customClass: {
              container: 'font-sans'
            }
          });
        } else {
          throw new Error('Action failed');
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to ${action} user. Please try again.`,
        icon: 'error',
        confirmButtonColor: '#d33',
        customClass: {
          container: 'font-sans'
        }
      });
      console.error('Error performing user action:', error);
    }
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPage(1);
    setSearch(value);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-600">Error fetching users: {error.toString()}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userdata && userdata.length > 0 ? (
              userdata.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <img
                      src={user.profilePhoto}
                      alt={user.userName}
                      className="h-10 w-10 rounded-full bg-gray-200"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete user"
                      >
                        <UserX onClick={() => handleUserStatusChange(user)} className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 px-6 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
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
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
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

export default UserList;
