import React, { useEffect, useState } from 'react';
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
  Search,
  Minus,
  X,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import useDebouncedValue from '../../hooks/debounceHook';
import { useInstituteListQuery } from '../../store/slices/adminSlice';
import InstitutionPieChart from './InstitutionPieChart';
import { InstituteDocument } from '../../types/Institute/InstituteDocument';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('');
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const {
    data: data
  } = useInstituteListQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    filter
  });

  const institutes = data?.institutes;
  const total = data?.total || 0;  
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const stats = {
    totalInstitutions: 24,
    pendingApprovals: 23,
    activeInstitutions: 124,
    totalTutors: 892,
    totalStudents: 12435
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Rejected':
        return <X className="w-5 h-5 text-red-500" />;
      case 'Inactive':
        return <Minus className="w-5 h-5 text-gray-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Verify':
        return <HelpCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
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
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search institutions..."
            className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      <div className='flex justify-between'>
      <div className="mt-10 mb-10">
        <InstitutionPieChart />
      </div>

      <div className="bg-white rounded-lg shadow-sm border ml-10">
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
                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tutors</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Students</th> */}
                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y">
              {institutes?.map((institution: InstituteDocument) => (
                <tr key={institution.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{institution.collegeName}</span>
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
                  <td className="px-4 py-3 text-gray-600">{new Date(institution.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</td>
                  {/* <td className="px-4 py-3 text-gray-600">20</td>
                  <td className="px-4 py-3 text-gray-600">25</td> */}
                  {/* <td className="px-4 py-3">
                    <button className="text-blue-500 hover:text-blue-700">View Details</button>
                  </td> */}
                </tr>
              ))}
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
      </div>
{/* 
      <div className="flex justify-end mt-6 space-x-4">
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