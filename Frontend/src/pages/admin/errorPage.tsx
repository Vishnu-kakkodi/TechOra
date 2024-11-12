import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        
        <div className="w-full flex justify-center my-8">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-indigo-600 rounded-full animate-spin border-t-transparent" />
            <div className="w-20 h-20 border-8 border-indigo-400 rounded-full animate-spin border-t-transparent absolute top-2 left-2" />
            <div className="w-16 h-16 border-8 border-indigo-200 rounded-full animate-spin border-t-transparent absolute top-4 left-4" />
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Home Page
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-100" />
      </div>
    </div>
  );
};

export default ErrorPage;