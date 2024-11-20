
import React from 'react';
import { CheckCircle, Clock, XCircle, Building2, Calendar, MessageCircle } from 'lucide-react';

interface StatusTrackerProps {
  status?: string;
  applicationData?: {
    instituteName?: string;
    submittedDate?: string;
    currentStage?: string;
    comments?: string[];
  };
  onClose: () => void;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({ 
  status = 'Pending', 
  applicationData = {
    instituteName: '',
    submittedDate: '',
    currentStage: '',
    comments: []
  }, 
  onClose 
}) => {
  const statuses = [
    { key: 'Pending', label: 'Application Pending', description: 'Your application is under initial review' },
    { key: 'Verify', label: 'Verification Initiated', description: 'Documents are being verified' },
    { key: 'Approved', label: 'Application Approved', description: 'Your institution has been approved' },
    { key: 'Rejected', label: 'Application Rejected', description: 'Application did not meet requirements' }
  ];

  const getStatusIndex = (currentStatus: string) => {
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const getStatusColor = (itemStatus: string) => {
    if (status === 'Rejected') {
      return itemStatus === 'rejected' ? 'text-red-500' : 'text-gray-300';
    }
    
    const currentIndex = getStatusIndex(status);
    const itemIndex = getStatusIndex(itemStatus);
    
    if (itemIndex < currentIndex) return 'text-green-500';
    if (itemIndex === currentIndex) {
      return status === 'Approved' ? 'text-green-500' : 'text-blue-500';
    }
    return 'text-gray-300';
  };

  const getStatusIcon = (itemStatus: string) => {
    if (status === 'Rejected' && itemStatus === 'Rejected') {
      return <XCircle className="w-8 h-8 text-red-500" />;
    }
    
    const currentIndex = getStatusIndex(status);
    const itemIndex = getStatusIndex(itemStatus);
    
    if (itemIndex < currentIndex) {
      if (status === 'Rejected') {
        return <Clock className="w-8 h-8 text-gray-300" />;
      }
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
    if (itemIndex === currentIndex) {
      if (status === 'Approved') {
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      }
      return <Clock className="w-8 h-8 text-blue-500 animate-pulse" />;
    }
    return <Clock className="w-8 h-8 text-gray-300" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Institution Application Status
          </h2>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Institution Name</p>
                <p className="font-medium">{applicationData.instituteName || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Submission Date</p>
                <p className="font-medium">{applicationData.submittedDate || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {statuses.map((item, index) => (
              <div key={item.key} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.key)}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${getStatusColor(item.key)}`}>
                      {item.label}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {index < statuses.length - 1 && (
                  <div className="absolute left-4 top-10 ml-[11px] h-14 w-[2px] bg-gray-200">
                    {getStatusIndex(status) > index && status !== 'rejected' && (
                      <div className="absolute inset-0 bg-green-500" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {applicationData.comments && applicationData.comments.length > 0 && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <h4 className="font-medium text-gray-800">Application Comments</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {applicationData.comments.map((comment, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-800">Current Status:</h4>
            <p className="mt-1 text-gray-600">
              {status === 'Pending' && "Your application is currently under review. We'll update you once verification begins."}
              {status === 'Verify' && "We're verifying your institution's details and documentation. This may take 2-3 business days."}
              {status === 'Approved' && "Congratulations! Your institution has been approved. You can now access all features."}
              {status === 'Rejected' && "Unfortunately, your application has been rejected. Resubmit your documents"}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;