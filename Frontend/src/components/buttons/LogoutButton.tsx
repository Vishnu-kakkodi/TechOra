import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/hook';
import { useUserLogoutCallMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';


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
    const [userLogoutCall] = useUserLogoutCallMutation();


    const handleLogout = async () => {
        const response = await userLogoutCall().unwrap();
        toast.success("Logout successfully");
        dispatch(userLogout())
        navigate('/');
    }
    
    return (
        <>
        <button
        onClick={handleLogout}
        className={` ml-[100px] text-[14px] font-[800] capitalize text-black bg-transparent border-2 border-black hover:bg-yellow-500 hover:text-black px-[30px] py-[11px]`}>
        Logout
        </button>
        </>
    )
}

export default LogoutButton