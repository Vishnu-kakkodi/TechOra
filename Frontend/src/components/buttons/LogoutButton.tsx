import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/hook';


interface LogoutButtonProps{
    label?: string;
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps>=({
    label = 'Logout',
    className = '',
}) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(userLogout())
        navigate('/');
    }
    
    return (
        <>
        <button
        onClick={handleLogout}
        className={` ml-[100px] text-[14px] font-normal capitalize text-white bg-transparent border-2 border-gold hover:bg-yellow-500 hover:text-black px-[30px] py-[11px] rounded-full`}>
        Logout
        </button>
        </>
    )
}

export default LogoutButton