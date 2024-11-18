import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Users,
  Building2,
  GraduationCap,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Search
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = {
    totalInstitutions: 156,
    pendingApprovals: 23,
    activeInstitutions: 124,
    totalTutors: 892,
    totalStudents: 12435
  };

  const recentInstitutions = [
    { id: 1, name: "College of Engineering Trivandrum", status: "approved", date: "2024-03-15", tutors: 45, students: 1200 },
    { id: 2, name: "TKM College of Engineering", status: "pending", date: "2024-03-14", tutors: 0, students: 0 },
    { id: 3, name: "Government Engineering College Thrissur", status: "rejected", date: "2024-03-13", tutors: 0, students: 0 },
    { id: 4, name: "Model Engineering College", status: "approved", date: "2024-03-12", tutors: 32, students: 850 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search institutions..."
            className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-[50%] transform -translate-y-[50%]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Institutions</p>
              <p className="text-2xl font-bold">{stats.totalInstitutions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-600 text-sm">Pending Approvals</p>
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600 text-sm">Active Institutions</p>
              <p className="text-2xl font-bold">{stats.activeInstitutions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Tutors</p>
              <p className="text-2xl font-bold">{stats.totalTutors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Institutions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Institution Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tutors</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Students</th>
                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentInstitutions.map((institution) => (
                <tr key={institution.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{institution.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(institution.status)}
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(institution.status)}`}>
                        {institution.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{institution.date}</td>
                  <td className="px-4 py-3 text-gray-600">{institution.tutors}</td>
                  <td className="px-4 py-3 text-gray-600">{institution.students}</td>
                  {/* <td className="px-4 py-3">
                    <button className="text-blue-500 hover:text-blue-700">View Details</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex justify-end mt-6 space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          View All Institutions
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors">
          Pending Approvals
        </button>
      </div> */}
    </div>
  );
};

export default Dashboard;