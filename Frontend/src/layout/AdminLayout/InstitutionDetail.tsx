
import React, { useState, useEffect } from 'react';
import { Check, X, Building2, Mail, HashIcon, Globe, MapPin, Flag, AlertCircle } from 'lucide-react';
import { useInstituteApproveMutation, useInstituteBlockMutation, useInstituteListQuery, useInstituteRejectMutation, useInstituteUnBlockMutation } from '../../store/slices/adminSlice';
import { useParams } from 'react-router-dom';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { toast } from 'react-toastify';

const InstitutionDetail = () => {
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const { instituteId } = useParams<{ instituteId: string }>();
  const { data: { institutes } = {}, isLoading, refetch } = useInstituteListQuery(null);
  const [currentInstitute, setCurrentInstitute] = useState<InstituteDocument | null>(null);
  const [instituteApprove] = useInstituteApproveMutation();
  const [instituteReject] = useInstituteRejectMutation();
  const [instituteBlock] = useInstituteBlockMutation();
  const [instituteUnBlock] = useInstituteUnBlockMutation();

  useEffect(() => {
    if (institutes && instituteId) {
      const found = institutes.find((inst: InstituteDocument) => inst._id === instituteId);
      if (found) {
        setCurrentInstitute(found);
        setStatus(found.status.toLowerCase());
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

  const handleApprove = async (instituteId: string) => {
    setLoading(true);
    try {
      await instituteApprove(instituteId);
      toast.success("Institute approved successfully");
      await refetch();
      setStatus('approved');
    } catch (error) {
      console.error('Error approving institute:', error);
      toast.error("Failed to approve institute");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (instituteId: string) => {
    setLoading(true);
    try {
      await instituteReject(instituteId);
      toast.success("Institute rejected successfully");
      await refetch();
      setStatus('rejected');
    } catch (error) {
      console.error('Error rejecting institute:', error);
      toast.error("Failed to reject institute");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (instituteId: string) => {
    setLoading(true);
    try {
      await instituteBlock(instituteId);
      toast.success("Institute blocked successfully");
      await refetch();
      setStatus('blocked');
    } catch (error) {
      console.error('Error blocking institute:', error);
      toast.error("Failed to block institute");
    } finally {
      setLoading(false);
    }
  };

  const handleUnBlock = async (instituteId: string) => {
    setLoading(true);
    try {
      await instituteUnBlock(instituteId);
      toast.success("Institute unblocked successfully");
      await refetch();
      setStatus('approved');
    } catch (error) {
      console.error('Error unblocking institute:', error);
      toast.error("Failed to unblock institute");
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = () => {
    const instituteStatus = currentInstitute.status
    
    if (instituteStatus === 'Rejected') {
      return <div className="text-gray-500">This institution has been rejected</div>;
    }

    if (instituteStatus === 'Active') {
      return (
        <div className="flex flex-col gap-10">
          <button
            onClick={() => handleBlock(currentInstitute._id)}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
              ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              transition duration-200 ease-in-out`}
          >
            <X className="w-5 h-5" />
            Block
          </button>
        </div>
      );
    }

    if (instituteStatus === 'Inactive') {
      return (
        <div className="flex flex-col gap-10">
          <button
            onClick={() => handleUnBlock(currentInstitute._id)}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
              ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              transition duration-200 ease-in-out`}
          >
            <Check className="w-5 h-5" />
            Unblock
          </button>
        </div>
      );
    }

    if(instituteStatus==='Pending'|| instituteStatus==='Verify'){
      return (
        <div className="flex flex-col gap-10">
          <button
            onClick={() => handleApprove(currentInstitute._id)}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
              ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              transition duration-200 ease-in-out`}
          >
            <Check className="w-5 h-5" />
            Approve Institution
          </button>
          <button
            onClick={() => handleReject(currentInstitute._id)}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
              ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              transition duration-200 ease-in-out`}
          >
            <X className="w-5 h-5" />
            Reject Institution
          </button>
        </div>
      );
    }

  };

  return (
    <div className="p-8 space-y-8 max-w-screen-lg mt-[50px] ml-[80px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Institution Details</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white 
          ${status === 'pending' ? 'bg-yellow-500' : 
            status === 'approved' || status === 'active' ? 'bg-green-500' : 
            status === 'blocked' ? 'bg-orange-500' : 'bg-red-500'}`}>
          {currentInstitute.status}
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
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetail;