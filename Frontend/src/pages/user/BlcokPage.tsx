import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance';
import { useAppSelector } from '../../store/hook';
const BlockPage = () => {
  const navigate = useNavigate();
  const userdata = useAppSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        if (userdata?.status==='active') {
            return navigate('/', { replace: true });

          }
        const response = await axiosInstance.get('/api/auth/verify-account-status');
        if (response.data.isActive) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error verifying account status:', error);
      }
    };

    checkAccountStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="text-center p-6">
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Account Blocked</h1>
          <p className="mt-2 text-gray-600">
            Your account has been temporarily suspended by the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockPage;
