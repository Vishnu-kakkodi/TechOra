import React from 'react';

const TimeWarningToast = ({ seconds }:{seconds:any}) => {
  if (seconds <= 60 && seconds > 0) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Hurry! Less than a minute remaining.</span>
      </div>
    );
  }
  
  return null;
};

export default TimeWarningToast;