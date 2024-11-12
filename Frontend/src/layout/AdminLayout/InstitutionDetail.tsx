import React, { useState, useEffect } from 'react';
import { Check, X, Building2, Mail, HashIcon, Globe, MapPin, Flag, AlertCircle } from 'lucide-react';
import { useInstituteApproveMutation, useInstituteListQuery } from '../../store/slices/adminSlice';
import { useParams } from 'react-router-dom';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';

const InstitutionDetail = () => {
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const { instituteId } = useParams<{ instituteId: string }>();
  const { data: { institutes } = {}, isLoading } = useInstituteListQuery(null);
  const [currentInstitute, setCurrentInstitute] = useState<InstituteDocument | null>(null);
  const [instituteApprove] = useInstituteApproveMutation();

  useEffect(() => {
    if (institutes && instituteId) {
      console.log('Searching for institute with ID:', instituteId);
      console.log('Available institutes:', institutes);
      
      const found = institutes.find((inst: InstituteDocument) => {
        console.log('Comparing:', inst._id, instituteId);
        return inst._id === instituteId;
      });
      
      if (found) {
        console.log('Found institute:', found);
        setCurrentInstitute(found);
      } else {
        console.log('Institute not found');
      }
      setLoading(false);
    }
  }, [institutes, instituteId]);

  if (isLoading || loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading institute details...</p>
      </div>
    );
  }

  if (!currentInstitute) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Institute not found. Please check the ID: {instituteId}</p>
      </div>
    );
  }

  const handleApprove = async (instituteId: any) => {
    setLoading(true);
    try {
      const response = await instituteApprove(instituteId)
      console.log(response.data);
      setStatus('approved');
    } catch (error) {
      console.error('Error approving institute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      // Add your rejection logic here
      setStatus('rejected');
    } catch (error) {
      console.error('Error rejecting institute:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-screen-lg mt-[50px] ml-[80px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Institution Details</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white 
            ${status === 'pending' ? 'bg-yellow-500' : status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">College Name</p>
                  <p className="font-medium">{currentInstitute.collegeName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{currentInstitute.instituteEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HashIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">College Code</p>
                  <p className="font-medium">{currentInstitute.collegeCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{currentInstitute.country || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{currentInstitute.state || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Flag className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{currentInstitute.district || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700">
              Application ID: {currentInstitute.applicationId}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-2">Actions</h2>
          <div className="flex flex-col gap-10">
            <button
              onClick={() => handleApprove(currentInstitute._id)}
              disabled={status === 'approved' || loading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
                ${status === 'approved' || loading 
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
                } transition duration-200 ease-in-out`}
            >
              <Check className="w-5 h-5" />
              Approve Institution
            </button>
            <button
              onClick={handleReject}
              disabled={status === 'rejected' || loading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
                ${status === 'rejected' || loading 
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
                } transition duration-200 ease-in-out`}
            >
              <X className="w-5 h-5" />
              Reject Institution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetail;