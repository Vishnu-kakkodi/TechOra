import React from 'react'
import { UserX } from 'lucide-react';

interface IUser {
    id: number;
    userName: string;
    email: string;
    phoneNumber: string;
    status: 'active' | 'inactive';
    avatarUrl: string;
  }
  
  const sampleUsers: IUser[] = [
    {
      id: 1,
      userName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1 (555) 123-4567",
      status: "active",
      avatarUrl: "/api/placeholder/40/40"
    },
    {
      id: 2,
      userName: "Jane Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+1 (555) 234-5678",
      status: "active",
      avatarUrl: "/api/placeholder/40/40"
    },
    {
      id: 3,
      userName: "Mike Johnson",
      email: "mike.j@example.com",
      phoneNumber: "+1 (555) 345-6789",
      status: "inactive",
      avatarUrl: "/api/placeholder/40/40"
    },
    {
      id: 4,
      userName: "Sarah Williams",
      email: "sarah.w@example.com",
      phoneNumber: "+1 (555) 456-7890",
      status: "active",
      avatarUrl: "/api/placeholder/40/40"
    },
    {
      id: 5,
      userName: "Alex Brown",
      email: "alex.b@example.com",
      phoneNumber: "+1 (555) 567-8901",
      status: "inactive",
      avatarUrl: "/api/placeholder/40/40"
    }
  ];

const StudentsList = () => {
  return (
    <div>
        <h1>New Students List</h1>

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
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
            {sampleUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <img
                    src={user.avatarUrl}
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
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
    </div>
  )
}

export default StudentsList