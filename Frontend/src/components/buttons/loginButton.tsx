import React from 'react';
interface LoginButtonProps{
    label?: string;
    className?:string;
    handleLogin?: () => void
    setModalOpen?: (state: boolean) => void;
}

const LoginButton: React.FC<LoginButtonProps>=({
    label = 'Login',
    className = '',
    handleLogin
}) => {
    return (
        <>
        <button
        onClick={handleLogin}
        className={`ml-4 text-[14px] font-[800] capitalize text-black bg-transparent border-2 border-black hover:bg-yellow-500 hover:text-black px-[30px] py-[11px]`}>
            Log in
        </button>
        </>
    )
}

export default LoginButton