import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import OTPIMG from '../../assets/frontEnd/OTPIMG.jpeg';
import Modal from '../../components/modals/Modal';
import { useRegisterMutation, useVerifyUserMutation } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/slices/authSlice';
import { useEmailVerifyMutation, useOtpVerifyMutation } from '../../store/slices/institutionSlice';

interface OtpModalProps {
  setOtpModalOpen: (open: boolean) => void;
  mode: 'signup' | 'verifyEmail' ;
}

const OtpModal: React.FC<OtpModalProps> = ({ setOtpModalOpen, mode }) => {
  const [register] = useRegisterMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [emailVerify] = useEmailVerifyMutation();
  const [otpVerify] = useOtpVerifyMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState<number>(59);
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '']);

  const formik = useFormik({
    initialValues: {
      otpCode: '',
    },
    onSubmit: async () => {
      const otp: string = otpCode.join('');
      try {
        setOtpModalOpen(false);

        if (mode === 'signup') {
          const response = await verifyUser({ otp }).unwrap();
          if (response.user) {
            dispatch(setCredentials(response.user));
            navigate('/home');
          }
        } else if (mode === 'verifyEmail') {
          const response = await otpVerify({otp}).unwrap();
          if (response) {
            navigate('/institute/register');
          }
        }
      } catch (error) {
        console.error('Error during OTP verification:', error);
      }
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/)) {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);

      if (index < otpCode.length - 1 && value) {
        const nextInput = document.getElementById(`otpCode${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const resendOTP = () => {
    setSeconds(59);

    if (mode === 'signup') {

    } else if (mode === 'verifyEmail') {

    } else if (mode === 'forgotPassword') {

    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds]);

  return (
    <Modal onClose={() => setOtpModalOpen(false)}>
      <div className="relative w-[550px] h-[400px] bg-white rounded-lg shadow-lg p-6">
        <p className="text-[25px] font-bold text-center text-black mt-[10px] mb-6 font-jakarta capitalize">
          OTP Verification
        </p>
        <p className="text-[14px] text-center text-black mb-6 font-jakarta capitalize">
          Enter OTP Code
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-x-[15px] text-center">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                id={`otpCode${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-11 h-11 border border-gray-400 rounded-[4px] text-center text-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            ))}
          </div>
          {formik.touched.otpCode && formik.errors.otpCode ? (
            <div className="text-red-500 text-sm">{formik.errors.otpCode}</div>
          ) : null}

          <p className="text-[14px] text-center text-black mb-6 font-jakarta capitalize">
            Didn&apos;t receive OTP code?
          </p>
          <div className="countdown-text text-center">
            {seconds > 0 ? (
              <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
            ) : (
              <p>Didn't receive code?</p>
            )}
            <button
              disabled={seconds > 0}
              style={{
                color: seconds > 0 ? '#DFE3E8' : '#FF5630',
              }}
              onClick={resendOTP}
            >
              Resend OTP
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-yellow-500 flex justify-center text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Verify & Proceed
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OtpModal;
