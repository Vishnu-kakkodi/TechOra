import React, {useEffect} from 'react';
import { UseDispatch,useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../../store';

interface TutorLoginButtonProps{
    label?: string;
    className?:string;
    handleLogin?: () => void
    setModalOpen?: (state: boolean) => void;
}

const TutorButton: React.FC<TutorLoginButtonProps>=({
    label = 'Login',
    className = '',
    handleLogin
}) => {
    return (
        <>
        <button
        onClick={handleLogin}
        className={`ml-4 text-[14px] font-normal capitalize text-white bg-transparent border-2 border-gold hover:bg-yellow-500 hover:text-black px-[30px] py-[11px] rounded-full`}>
            Tutor
        </button>
        </>
    )
}

export default TutorButton