// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
//   type?: 'button' | 'submit' | 'reset';
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   onClick,
//   disabled = false,
//   className = '',
//   type = 'button',
// }) => {
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;
