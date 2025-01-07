import React from 'react';
import { Timer } from 'lucide-react';

interface CircularTimerProps {
  seconds: number;
  totalTime: number;
  formatTime: (seconds: number) => string;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
  seconds,
  totalTime,
  formatTime
}) => {
  // Calculate progress percentage
  const progress = ((totalTime - seconds) / totalTime) * 100;

  // Circle configuration
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color based on remaining time
  const getColorClass = () => {
    if (progress <= 25) return 'text-red-500 stroke-red-500';
    if (progress <= 50) return 'text-yellow-500 stroke-yellow-500';
    return 'text-green-500 stroke-green-500';
  };

  return (
    <div className="relative w-40 h-40">
      {/* Base circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 1s linear'
          }}
          className={getColorClass()}
        />
      </svg>

      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* <Timer className={`w-10 h-10 mb-1 ${getColorClass()}`} />
        <span className={`text-3xl font-bold ${getColorClass()}`}>
          {formatTime(seconds)}
        </span> */}
        <Timer className={`w-10 h-10 mb-1 ${getColorClass()}`} />
        <span className={`text-3xl font-bold ${getColorClass()}`}>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
};

export default CircularTimer;
