import React, {useEffect} from 'react';
import {
  Search,
  Download,
  Eye
} from 'lucide-react';
import { useInstituteListQuery } from '../../store/slices/adminSlice';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { useNavigate } from 'react-router-dom';




const InstitutionList = () => {



  const navigate = useNavigate();

  const { data: { institutes } = {}, refetch  } = useInstituteListQuery(null);
  console.log(institutes, "Haaaai");

  useEffect(() => {
    refetch(); 
  }, [institutes]);

    const handleViewApplication = async (instituteId: any) => {
      console.log(instituteId)
      navigate(`/admin/institute-detail/${instituteId}`)

      console.log(`Viewing application for institution ${instituteId}`);
    };

  //   const handleDownloadDocument = (institutionId, documentName) => {
  //     // Implement document download logic
  //     console.log(`Downloading ${documentName} for institution ${institutionId}`);
  //   };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Institutions List</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search institutions..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {/* <div className="flex flex-col gap-2">
                      {institution.documents.map((doc, index) => (
                        <button
                          key={index}
                        //   onClick={() => handleDownloadDocument(institution.id, doc.name)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {doc.name}
                        </button>
                      ))}
                    </div> */}
                    <div className="flex flex-col gap-2">
                      <button
                        //   onClick={() => handleDownloadDocument(institution.id, doc.name)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 ml-7 w-4 mr-2" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{institute.status}</div>
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
            ) : (
              <tr>
                <td colSpan={5} className="py-4 px-6 text-center text-gray-500">No institutions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                1
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionList;