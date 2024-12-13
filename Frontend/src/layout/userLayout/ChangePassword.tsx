import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import ChangePasswordIMG from '../../assets/frontEnd/ChangePassword.png';
import { useChangePasswordMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import { ApiError } from '../../types/ApiError';

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required')
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password')
});

const ChangePassword: React.FC = () => {
  const [changePassword] = useChangePasswordMutation();
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (
    values: PasswordValues, 
    { setSubmitting }: FormikHelpers<PasswordValues>
  ) => {
    try {
      const response = await changePassword(values).unwrap();;
      if(response){
      toast.success(response.message)
      }
      console.log('Password change submitted', response);
    } catch (error:unknown) {
        console.log(error,"Error")
        const ApiError = error as ApiError
          toast.error(ApiError.data.message)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='h-full bg-gradient-to-br from-indigo-100 to-purple-100 m-2 flex justify-center items-center p-8 border-2 border-brown-500  w-full'>
      <div className='flex shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full bg-white'>
        <div className='w-1/2 relative'>
          <img
            src={ChangePasswordIMG}
            alt="Change Password"
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70'></div>
        </div>
        <div className='w-1/2 p-12 bg-white flex flex-col justify-center'>
          <div className='flex justify-center mb-6'>
            <ShieldCheck className='w-16 h-16 text-blue-600 animate-pulse' />
          </div>
          <h1 className='text-3xl font-bold text-center mb-8 text-gray-800 tracking-tight'>
            Change Password
          </h1>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={PasswordChangeSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className='space-y-6'>
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <div key={field}>
                    <label 
                      htmlFor={field} 
                      className='block text-sm font-medium text-gray-700 mb-2 capitalize'
                    >
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Field name={field}>
                      {({ field: inputField, meta }) => (
                        <div className='relative'>
                          <input
                            {...inputField}
                            type={showPasswords[field] ? 'text' : 'password'}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300
                              ${meta.touched && meta.error 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300'
                              }`}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field as keyof typeof showPasswords)}
                            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition'
                          >
                            {showPasswords[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage 
                      name={field} 
                      component="p" 
                      className='text-red-500 text-xs mt-1 pl-1' 
                    />
                  </div>
                ))}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition duration-300 transform hover:scale-[1.02] shadow-lg'
                >
                  Change Password
                </button>
          </Form>
        )}
      </Formik>
    </div>
  </div>
</div>
  );
};

export default ChangePassword;