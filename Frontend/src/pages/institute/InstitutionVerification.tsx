import React from 'react';
import { useFormik } from 'formik';
import { AdminTypes } from '../../types/adminTypes';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useVerifyAdminMutation } from '../../store/slices/adminSlice';
import { setAdminCredentials } from '../../store/slices/authSlice';
import loginPage from '../../assets/frontEnd/registerPage.jpg'

const InstituteLogin: React.FC = () => {
  const [adminLogin] = useVerifyAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik<AdminTypes>({
    initialValues: {
      adminEmail: '',
      adminPassword: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await adminLogin(values).unwrap();
        toast.success('Admin login successful!');
        dispatch(setAdminCredentials({ ...response.admin }));
        navigate('/institute/dashboard');
      } catch (err) {
        console.error('Admin login error:', err);
        toast.error('Login failed. Please check your credentials.'); 
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRegister = () => {
    navigate('/institute/register'); 
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative" 
      style={{ backgroundImage: `url(${loginPage})` }}
    >
      {/* Background overlay for better contrast */}


      <div className="relative w-[600px] bg-black bg-opacity-70 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Institute Login</h2>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="adminEmail" className="block text-white mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.adminEmail}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.adminEmail && formik.touched.adminEmail ? 'border-red-500 ring-red-500' : 'border-gray-300 ring-indigo-300'} transition duration-200`}
            />
            {formik.errors.adminEmail && formik.touched.adminEmail && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.adminEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-white mb-2">
              Institution ID<span className="text-red-500">*</span>
            </label>
            <input
              id="adminPassword"
              name="adminPassword"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.adminPassword}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.adminPassword && formik.touched.adminPassword ? 'border-red-500 ring-red-500' : 'border-gray-300 ring-indigo-300'} transition duration-200`}
            />
            {formik.errors.adminPassword && formik.touched.adminPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.adminPassword}</p>
            )}
          </div>

          <div className="flex justify-between">
            <button 
              type="submit" 
              className={`h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Logging in...' : 'Submit Now'}
            </button>
            <button 
              type="button"
              onClick={handleRegister} 
              className="h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteLogin;
