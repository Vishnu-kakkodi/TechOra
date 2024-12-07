
import React, { useEffect, useState } from 'react';
import {
    Search,
    Download,
    Eye,
    Building2
} from 'lucide-react';
import { useInstituteListQuery, useDocumentDownloadMutation } from '../../store/slices/adminSlice';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { useNavigate } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';

const ApprovedInstitution = () => {
    const navigate = useNavigate();
    const [downloading, setDownloading] = useState<string | null>(null);
    const [downloadDocument] = useDocumentDownloadMutation();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4); 
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebouncedValue(search, 500);
  
    const {
      data: { institutes, total } = {},
      isLoading,
      error,
      refetch
    } = useInstituteListQuery({
      page,
      limit,
      search: debouncedSearchTerm,
    });
  
    console.log(institutes)
  
    useEffect(() => {
      setPage(1);
    }, [debouncedSearchTerm]);
  
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setPage(1);
      setSearch(value);
    };
  
    const handleViewApplication = (instituteId: string) => {
      navigate(`/admin/institute-detail/${instituteId}`);
    };
  
    const handleDownloadDocument = async (url: string, fileName: string) => {
      if (!url) {
        console.error('No document URL provided');
        return;
      }
  
      try {
        const response = await downloadDocument(url).unwrap();
        console.log(response,"Res")
        const blob = new Blob([response], { type: response.type || 'application/octet-stream' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        }, 100);
  
      } catch (error) {
        console.error('Error downloading document:', error);
        alert('Failed to download document. Please try again.');
      } finally {
        setDownloading(null);
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
        <div className="w-full bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Institutions List</h2>
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
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application No.</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Code</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {institutes ? (
                            institutes.map((institute: InstituteDocument) => (
                                <tr key={institute.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium text-gray-900">{institute.applicationId}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium text-gray-900">{institute.collegeName}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-500">{institute.instituteEmail}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-500">{institute.collegeCode}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-2">
                                            {institute.documentUrl && (
                                                <button
                                                    onClick={() => handleDownloadDocument(
                                                        institute.documentUrl,
                                                        `${institute.collegeName}_document.pdf`
                                                    )}
                                                    disabled={downloading === institute.documentUrl}
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    {downloading === institute.documentUrl ? 'Downloading...' : 'Download Document'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {institute.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewApplication(institute._id)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : null}
                        {institutes && institutes.filter(institute => institute.status === 'Active').length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 px-6 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Building2 className="h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-lg font-medium">No Active Institutions</p>
                                        <p className="text-sm">There are currently no active institutions in the system.</p>
                                    </div>
                                </td>
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

export default ApprovedInstitution;