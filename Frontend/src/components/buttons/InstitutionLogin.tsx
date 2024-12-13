import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginButtonProps {
    label?: string;
    className?: string;
    handleLogin?: () => void;
    setModalOpen?: (state: boolean) => void;
}

const InstitutionLogin: React.FC<LoginButtonProps> = ({
    label = 'Institute',
    className = '',
}) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/institute/login')} 
            className={`ml-4 text-[14px] font-normal capitalize text-white bg-transparent border-2 border-gold hover:bg-yellow-500 hover:text-black px-[30px] py-[11px] rounded-full`}
        >
            {label}
        </button>
    );
}

export default InstitutionLogin;