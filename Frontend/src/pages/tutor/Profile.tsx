
import React, { useState, useEffect } from 'react';
import { Upload, User, GraduationCap, Briefcase, Edit, Save, X } from 'lucide-react';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { useAppSelector } from '../../store/hook';
import { useUpdateProfileMutation, useUploadPhotoMutation } from '../../store/slices/tutorSlice';
import { toast } from 'react-toastify';
import { setTutorCredential, updateTutorField } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePhoto] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState(null);
  const [tutorDetails, setTutorDetails] = useState({
    tutorname: '',
    tutorEmail: '',
    collegeName: '',
    education: '',
    experiance: '',
    department: '',
    profilePic: ''
  });

  const dispatch = useDispatch();

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [uploadPhoto, { isLoading: isUploadingPhoto }] = useUploadPhotoMutation();

  const tutorData = useAppSelector((state) => state.auth.tutorInfo);
  console.log(tutorData?.profilePic,"pp")

  useEffect(() => {
    if (tutorData) {
      setTutorDetails({
        tutorname: tutorData.tutorname || '',
        tutorEmail: tutorData.tutorEmail || '',
        collegeName: tutorData.institutionId?.collegeName || '',
        education: tutorData.education || '',
        experiance: tutorData.experiance || '',
        department: tutorData.department || '',
        profilePic: tutorData.profilePic || '',
      });
      setProfilePhoto(tutorData.profilePic || null);
    }
  }, [tutorData,tutorData?.profilePic]);

  // const handlePhotoUpload = async (event:any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImageFile(file);

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfilePhoto(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handlePhotoUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePhoto(reader.result); 
        }
      };
      reader.readAsDataURL(file); 
    }
  };
  

  const handleSubmitPhoto = async () => {
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('profilePic', imageFile);
        
        const response = await uploadPhoto({
            body:formData
        }).unwrap();

        console.log(response.data)
        toast.success(response.message);

        dispatch(updateTutorField({
            field: 'profilePic',
            value: response.data.profilePic
        }));

        setProfilePhoto(response.data.profilePic);

        
        setImageFile(null);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setTutorDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile(tutorDetails).unwrap();

      dispatch(setTutorCredential(response.data));

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };


  const handleCancel = () => {
    if (tutorData) {
      setTutorDetails({
        tutorname: tutorData.tutorname || '',
        tutorEmail: tutorData.tutorEmail || '',
        collegeName: tutorData.institutionId?.collegeName || '',
        education: tutorData.education || '',
        experiance: tutorData.experiance || '',
        department: tutorData.department || '',
        profilePic: tutorData.profilePic || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className='flex'>
      <TutorSidebar/>
      <div className="max-w-4xl mx-auto p-6 w-full">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Tutor Profile</h2>
            </div>
            {!isEditing ? (
              <button 
                onClick={handleEditToggle}
                className="flex items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                <Edit className="mr-2" size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="flex items-center bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Save className="mr-2" size={18} /> Save Details
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  <X className="mr-2" size={18} /> Cancel
                </button>
              </div>
            )}
          </div>
        
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {/* Profile Photo Section */}
            <div className="col-span-1 flex flex-col justify-center items-center border-2">
              <div className="w-48 h-48 mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-gray-400" />
                )}
              </div>
              {isEditing && (
                <>
                  <input 
                    type="file" 
                    accept="image/*"
                    id="profilePhotoUpload"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <div className="flex space-x-2 p-2">
                    <label 
                      htmlFor="profilePhotoUpload" 
                      className="cursor-pointer flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      <Upload className="mr-2" /> Choose Photo
                    </label>
                    {imageFile && (
                      <button 
                        onClick={handleSubmitPhoto}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Upload Photo
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="col-span-2 space-y-4 border-2 p-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="mr-2" /> Full Name
                </label>
                {isEditing ? (
                  <input 
                    name="tutorname"
                    value={tutorDetails.tutorname}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="w-full px-3 py-2">{tutorDetails.tutorname || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input 
                    name="tutorEmail"
                    disabled
                    value={tutorDetails.tutorEmail}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="w-full px-3 py-2">{tutorDetails.tutorEmail || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <GraduationCap className="mr-2" /> College & Education
                </label>
                {isEditing ? (
                  <>
                    <input 
                      name="collegeName"
                      disabled
                      value={tutorDetails.collegeName}
                      onChange={handleInputChange}
                      placeholder="University/College Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <input 
                      name="education"
                      value={tutorDetails.education}
                      onChange={handleInputChange}
                      placeholder="Degree (e.g., B.Tech, M.Sc)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                ) : (
                  <>
                    <p className="w-full px-3 py-2">{tutorDetails.collegeName || 'Not provided'}</p>
                    <p className="w-full px-3 py-2">{tutorDetails.education || 'No degree specified'}</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Briefcase className="mr-2" /> Teaching experiance
                </label>
                {isEditing ? (
                  <input 
                    name="experiance"
                    value={tutorDetails.experiance}
                    onChange={handleInputChange}
                    placeholder="Years of teaching experiance"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="w-full px-3 py-2">{tutorDetails.experiance ? `${tutorDetails.experiance} years` : 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input 
                    name="department"
                    disabled
                    value={tutorDetails.department}
                    onChange={handleInputChange}
                    placeholder="Your department"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="w-full px-3 py-2">{tutorDetails.department || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;