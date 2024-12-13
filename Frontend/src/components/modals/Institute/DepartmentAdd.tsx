import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { useAddDepartmentMutation } from '../../../store/slices/institutionSlice';
import { toast } from 'react-toastify';

const DepartmentValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Department name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name must be less than 50 characters'),
});

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (departmentData: {
    name: string;
  }) => void;
}

const DepartmentAdd: React.FC<AddDepartmentModalProps> = ({ 
  isOpen, 
  onClose, 
}) => {
  if (!isOpen) return null;

  const [addDepartment] = useAddDepartmentMutation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
        
        <Formik
          initialValues={{
            name: ''
          }}
          validationSchema={DepartmentValidationSchema}
          onSubmit={ async (values, { resetForm }) => {
              try{
                const department = values.name
                const response = await addDepartment({department}).unwrap()
              toast.success(response.message);
            resetForm();
            onClose();
              }catch(error){
                console.log(error);
              }
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                    ${errors.name && touched.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                  placeholder="Enter department name"
                />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>
        
          
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Department
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DepartmentAdd;