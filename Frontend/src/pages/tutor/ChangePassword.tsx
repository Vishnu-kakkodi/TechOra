import React, { useState, FormEvent } from 'react';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordValidationResult {
  valid: boolean;
  message: string;
}

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const validatePassword = (password: string): PasswordValidationResult => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      valid: password.length >= minLength && 
             hasUppercase && 
             hasLowercase && 
             hasNumber && 
             hasSpecialChar,
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    };
  };

  const handleChangePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.valid) {
      setError(newPasswordValidation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      console.log('Changing password');
      setSuccess('Password changed successfully!');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  const PasswordInput: React.FC<PasswordInputProps> = ({ 
    value, 
    onChange, 
    placeholder, 
    showPassword, 
    toggleShowPassword 
  }) => (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md pr-10"
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={toggleShowPassword}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  return (
    <div className='flex'>
      <TutorSidebar />
      <div className="flex-grow p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Password
              </label>
              <PasswordInput
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter current password"
                showPassword={showCurrentPassword}
                toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <PasswordInput
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Enter new password"
                showPassword={showNewPassword}
                toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
              />
              <p className="text-xs text-gray-600 mt-1">
                At least 8 characters, include uppercase, lowercase, number, and special character
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm new password"
                showPassword={showConfirmPassword}
                toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;