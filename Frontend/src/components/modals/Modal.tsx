import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white  rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-lg font-bold"
        >
        <X className="w-6 h-6" />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;



