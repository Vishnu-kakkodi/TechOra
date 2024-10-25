import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-lg font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
