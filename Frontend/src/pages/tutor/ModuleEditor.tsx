import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { Module } from 'src/types/courseType';

const ModuleEditModal = ({ module, isOpen, onClose, onSave }:{module:Module | null;isOpen:any;onClose:any;onSave:any}) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters'),
    duration: Yup.string()
      .required('Duration is required'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Module</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <Formik
          initialValues={{
            title: module?.title,
            duration: module?.duration,
            description: module?.description,
            video: null
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSave(values);
            onClose();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Field
                  type="text"
                  name="title"
                  className="w-full border rounded px-2 py-1"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <Field
                  type="text"
                  name="duration"
                  className="w-full border rounded px-2 py-1"
                />
                <ErrorMessage name="duration" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border rounded px-2 py-1"
                  rows={4}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModuleEditModal;