
import React, { useState, useEffect } from 'react';
import { Check, X, Building2, Mail, HashIcon, Globe, MapPin, Flag, AlertCircle } from 'lucide-react';
import { useInstituteApproveMutation, useInstituteBlockMutation, useInstituteListQuery, useInstituteRejectMutation, useInstituteUnBlockMutation, useInstituteViewQuery } from '../../store/slices/adminSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { InstituteDocument } from '../../types/Institute/InstituteDocument';

const InstitutionDetail = () => {
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const  instituteId  = useParams<{ instituteId: string }>();
  const [currentInstitute, setCurrentInstitute] = useState<InstituteDocument | null>(null);
  const [instituteApprove] = useInstituteApproveMutation();
  const [instituteReject] = useInstituteRejectMutation();
  const [instituteBlock] = useInstituteBlockMutation();
  const [instituteUnBlock] = useInstituteUnBlockMutation();

  const { 
    data: data,
    refetch 
  } = useInstituteViewQuery({
    instituteId: instituteId.instituteId
  });

  const institutes = data?.data || [];



  const handleApprove = async (instituteId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Approve Institution',
        text: 'Are you sure you want to approve this institution?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'font-sans'
        }
      });

      if (result.isConfirmed) {
        setLoading(true);
        await instituteApprove(instituteId);
        await refetch();
        setStatus('approved');
        
        Swal.fire({
          title: 'Approved!',
          text: 'Institution has been approved successfully.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          customClass: {
            container: 'font-sans'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to approve institution. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        customClass: {
          container: 'font-sans'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (instituteId: string) => {
    try {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject Institution',
        input: 'textarea',
        inputLabel: 'Reason for Rejection',
        inputPlaceholder: 'Please provide a reason for rejection...',
        inputAttributes: {
          'aria-label': 'Rejection reason'
        },
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a reason for rejection';
          }
          return null;
        },
        customClass: {
          container: 'font-sans'
        }
      });

      if (rejectReason) {
        setLoading(true);
        await instituteReject({ instituteId, rejectReason });
        await refetch();
        setStatus('rejected');

        Swal.fire({
          title: 'Rejected!',
          text: 'Institution has been rejected successfully.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          customClass: {
            container: 'font-sans'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to reject institution. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        customClass: {
          container: 'font-sans'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (instituteId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Block Institution',
        text: 'Are you sure you want to block this institution?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, block',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'font-sans'
        }
      });

      if (result.isConfirmed) {
        setLoading(true);
        await instituteBlock(instituteId);
        await refetch();
        setStatus('blocked');

        Swal.fire({
          title: 'Blocked!',
          text: 'Institution has been blocked successfully.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          customClass: {
            container: 'font-sans'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to block institution. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        customClass: {
          container: 'font-sans'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnBlock = async (instituteId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Unblock Institution',
        text: 'Are you sure you want to unblock this institution?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, unblock',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'font-sans'
        }
      });

      if (result.isConfirmed) {
        setLoading(true);
        await instituteUnBlock(instituteId);
        await refetch();
        setStatus('approved');

        Swal.fire({
          title: 'Unblocked!',
          text: 'Institution has been unblocked successfully.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          customClass: {
          container: 'font-sans'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to unblock institution. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        customClass: {
          container: 'font-sans'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = () => {
    const instituteStatus = institutes?.status

    if (instituteStatus === 'Rejected') {
      return <div className="text-gray-500">This institution has been rejected</div>;
    }

    if (instituteStatus === 'Active') {
      return (
        <div className="flex flex-col gap-10">
          <button
            onClick={() => handleBlock(institutes?._id)}
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
            onClick={() => handleUnBlock(institutes._id)}
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

    if (instituteStatus === 'Pending' || instituteStatus === 'Verify') {
      return (
        <div className="flex flex-col gap-10">
          <button
            onClick={() => handleApprove(institutes._id)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white 
              ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              transition duration-200 ease-in-out`}
          >
            <Check className="w-5 h-5" />
            Approve Institution
          </button>
          <button
            onClick={() => handleReject(institutes?._id)}
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
          {institutes?.status}
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
                  <p className="font-medium">{institutes?.collegeName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{institutes?.instituteEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HashIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">College Code</p>
                  <p className="font-medium">{institutes?.collegeCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{institutes?.country || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{institutes?.state || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Flag className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{institutes?.district || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700">
              Application ID: {institutes?.applicationId}
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





