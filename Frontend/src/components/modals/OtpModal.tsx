
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Modal from '../../components/modals/Modal';
import { useRegisterMutation, useResendOtpMutation, useVerifyUserMutation } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setInstituteEmailCredentials } from '../../store/slices/authSlice';
import { useEmailVerifyMutation, useOtpVerifyMutation } from '../../store/slices/institutionSlice';
import { useUserOtpVerifyMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';

interface OtpModalProps {
  setOtpModalOpen: (open: boolean) => void;
  mode: 'signup' | 'verifyEmail' | 'forgotPassword';
}

interface emailProps {
  status: number,
  message: string,
  data: string
}

const OtpModal: React.FC<OtpModalProps> = ({ setOtpModalOpen, mode }) => {
  const [register] = useRegisterMutation();
  const [resendOtp] = useResendOtpMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [emailVerify] = useEmailVerifyMutation();
  const [userOtpVerify] = useUserOtpVerifyMutation();
  const [otpVerify] = useOtpVerifyMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState<number>(59);
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '']);
  const [email, setEmail] = useState('');

  const formik = useFormik({
    initialValues: {
      otpCode: '',
    },
    onSubmit: async () => {
      const otp: string = otpCode.join('');
      try {
        switch (mode) {
          case 'signup':
            const signupResponse = await verifyUser({ otp }).unwrap();
            if (signupResponse.status===200) {
              toast.success('Account verified successfully!');
              navigate('/');
            }else{
              toast.error(signupResponse.message)
            }
            break;

          case 'verifyEmail':
            const emailResponse = await otpVerify({ otp }).unwrap();
            if (emailResponse.status===200) {
              toast.success('Email verified successfully!');
              dispatch(setInstituteEmailCredentials(emailResponse.email))
              navigate('/institute/register');
              setOtpModalOpen(false);
            }else{
              toast.error(emailResponse.message)
            }
            break;

          case 'forgotPassword':
            try {
              const res: emailProps = await userOtpVerify({ otp }).unwrap();
              if (res.status === 200) {
                  setEmail(res.data);
                  toast.success('OTP verified successfully!');
                  navigate('/forgot-password', {
                      state: { email: res.data },
                  });
                  setOtpModalOpen(false);
              } else {
                  toast.error(res.message);
              }
          } catch (error) {
              toast.error('An error occurred while verifying the OTP.');
          }
          break;
        }
      } catch (error: any) {
        console.error('Error during OTP verification:', error);
        toast.error(error.message || 'OTP verification failed. Please try again.');
      }
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);

      if (value === '' && index > 0) {
        const prevInput = document.getElementById(`otpCode${index - 1}`);
        if (prevInput) prevInput.focus();
      } else if (index < otpCode.length - 1 && value) {
        const nextInput = document.getElementById(`otpCode${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const resendOTP = async () => {
    setSeconds(59);
    if (mode === 'signup') {
      const response = await resendOtp().unwrap()
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
      <div className="relative w-full md:w-[550px] min-h-[400px] bg-white rounded-lg shadow-lg p-4 md:p-6 mx-auto">
        <div className="max-w-md mx-auto">
          <p className="text-xl md:text-[25px] font-bold text-center text-black mt-2 md:mt-[10px] mb-4 md:mb-6 font-jakarta capitalize">
            OTP Verification
          </p>
          <p className="text-[13px] md:text-[14px] text-center text-black mb-4 md:mb-6 font-jakarta capitalize">
            Enter OTP Code
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex justify-center gap-2 md:gap-[15px]">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otpCode${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-9 h-9 md:w-11 md:h-11 border border-gray-400 rounded-[4px] text-center text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ))}
            </div>
            {formik.touched.otpCode && formik.errors.otpCode ? (
              <div className="text-red-500 text-sm text-center">{formik.errors.otpCode}</div>
            ) : null}

            <p className="text-[13px] md:text-[14px] text-center text-black mb-4 md:mb-6 font-jakarta capitalize">
              Didn&apos;t receive OTP code?
            </p>
            <div className="countdown-text text-center text-sm md:text-base">
              {seconds > 0 ? (
                <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
              ) : (
                <p>Didn't receive code?</p>
              )}
              <button
                type="button"
                disabled={seconds > 0}
                className="mt-2 transition-colors"
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
                className="mt-4 bg-yellow-500 w-full md:w-auto flex justify-center text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm md:text-base"
              >
                Verify & Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;