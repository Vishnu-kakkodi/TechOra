// import React, { useRef, useState } from 'react'
// import { Camera, Mail, Edit2, Save } from 'lucide-react';
// import ProfilePic from '../../assets/frontEnd/ProfilePic.png'
// import { useAppSelector } from '../../store/hook';
// import { useProfilePhotoMutation, useUpdateProfileMutation } from '../../store/slices/userSlice';
// import { updateUserField } from '../../store/slices/authSlice';
// import { useDispatch, UseDispatch } from 'react-redux';


// const Profile = () => {
//     const [profileImage, setProfileImage] = useState<string | null>(ProfilePic);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const userdata = useAppSelector((state) => state.auth.userInfo);
//     const [profilePhoto] = useProfilePhotoMutation();
//     const [updateProfile] = useUpdateProfileMutation();
//     const dispatch = useDispatch()

//     const [editableFields, setEditableFields] = useState({
//         name: { value: userdata?.userName || 'User Name', isEditing: false },
//         phone: { value: userdata?.phoneNumber || 'Add Phone Number', isEditing: false },
//         address: { value: userdata?.address || 'Add Address', isEditing: false }
//     });

//     const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             try {
//                 const formData = new FormData();

//                 formData.append('profilePhoto', file);

//                 const response = await profilePhoto({body: formData}).unwrap();
//                 console.log("lllll");
                

//                 console.log(response.data.profilePhoto,"PPppppp")

//                 dispatch(updateUserField({
//                     field: 'profilePhoto',
//                     value: response.data.profilePhoto
//                 }));

//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     setProfileImage(reader.result as string);
//                 };
//                 reader.readAsDataURL(file);

//                 console.log('Profile photo updated successfully:', response);
//             } catch (error) {
//                 console.error('Error updating profile photo:', error);
//             }
//         }
//     };


//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     const toggleEdit = (field: keyof typeof editableFields) => {
//         setEditableFields(prev => ({
//             ...prev,
//             [field]: {
//                 ...prev[field],
//                 isEditing: !prev[field].isEditing
//             }
//         }));
//     };

//     const handleFieldChange = async (field: keyof typeof editableFields, newValue: string) => {
//         const fieldToApiKeyMap = {
//             name: 'userName',
//             phone: 'phoneNumber',
//             address: 'address'
//         };
    
//         try {
//             const response = await updateProfile({
//                 [fieldToApiKeyMap[field]]: newValue
//             }).unwrap();
    
//             // Update Redux state
//             dispatch(updateUserField({
//                 field: fieldToApiKeyMap[field],
//                 value: newValue
//             }));
    
//             // Update local state
//             setEditableFields(prev => ({
//                 ...prev,
//                 [field]: {
//                     value: newValue,
//                     isEditing: false  // Automatically disable editing mode after successful update
//                 }
//             }));
    
//             // You can add a success toast/message here
    
//         } catch (error) {
//             console.error('Error updating profile:', error);
//             // You can add error handling/toast here
//         }
//     };

//     return (
//         <div className='flex justify-center items-center h-full p-10 m-2 w-full gap-[50px] p-8 bg-gradient-to-br from-indigo-100 to-purple-100  border-2 border-brown-500 '>
//             {/* Profile Card */}
//             <div className="bg-white w-[350px] border-4 border-yellow-200  h-[500px] rounded-2xl shadow-4xl overflow-hidden transform transition-all duration-300 hover:scale-105">
//                 <div className="relative">
//                     <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-[320px]"></div>
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                         <div className="relative">
//                             <input
//                                 type="file"
//                                 ref={fileInputRef}
//                                 onChange={handleImageUpload}
//                                 accept="image/*"
//                                 className="hidden"
//                             />
//                             <img
//                                 className='w-[250px] h-[250px] object-cover rounded-full border-4 border-white shadow-lg'
//                                 src={userdata?.profilePhoto}
//                                 alt="profile"
//                             />
//                             <button
//                                 onClick={triggerFileInput}
//                                 className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
//                             >
//                                 <Camera
//                                     className="text-white"
//                                     size={16}
//                                     strokeWidth={2}
//                                 />
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="pt-[50px] text-center px-6 pb-6">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                         {(userdata?.userName)?.toUpperCase() || 'User Name'}
//                     </h2>
//                     <div className="flex items-center justify-center text-gray-600 mb-4">
//                         <Mail className="mr-2 w-5 h-5" />
//                         <span>{userdata?.email || 'email@example.com'}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Profile Details Edit */}
//             <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-8">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile Details</h2>
                
//                 {/* Name Field */}
//                 <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                         <label className="text-gray-600">Full Name</label>
//                         <button 
//                             onClick={() => toggleEdit('name')}
//                             className="text-blue-500 hover:text-blue-700"
//                         >
//                             {editableFields.name.isEditing ? <Save size={20} /> : <Edit2 size={20} />}
//                         </button>
//                     </div>
//                     {editableFields.name.isEditing ? (
//                         <input 
//                             type="text"
//                             value={editableFields.name.value}
//                             onChange={(e) => handleFieldChange('name', e.target.value)}
//                             className="w-full border-b-2 border-blue-500 focus:outline-none py-2"
//                         />
//                     ) : (
//                         <p className="text-xl font-medium">{editableFields.name.value}</p>
//                     )}
//                 </div>

//                 {/* Phone Field */}
//                 <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                         <label className="text-gray-600">Phone Number</label>
//                         <button 
//                             onClick={() => toggleEdit('phone')}
//                             className="text-blue-500 hover:text-blue-700"
//                         >
//                             {editableFields.phone.isEditing ? <Save size={20} /> : <Edit2 size={20} />}
//                         </button>
//                     </div>
//                     {editableFields.phone.isEditing ? (
//                         <input 
//                             type="text"
//                             value={editableFields.phone.value}
//                             onChange={(e) => handleFieldChange('phone', e.target.value)}
//                             className="w-full border-b-2 border-blue-500 focus:outline-none py-2"
//                         />
//                     ) : (
//                         <p className="text-xl font-medium">{editableFields.phone.value}</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Profile


import React, { useRef, useState } from 'react';
import { Camera, Mail, Edit2, Save } from 'lucide-react';
import { useAppSelector } from '../../store/hook';
import { useProfilePhotoMutation, useUpdateProfileMutation } from '../../store/slices/userSlice';
import { updateUserField } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Profile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userdata = useAppSelector((state) => state.auth.userInfo);
    const [profilePhoto] = useProfilePhotoMutation();
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch();

    console.log(userdata,"User")

    // Separate state for editing mode and field values
    const [editMode, setEditMode] = useState({
        name: false,
        phone: false,
        address: false
    });

    const [fieldValues, setFieldValues] = useState({
        name: userdata?.userName || 'User Name',
        phone: userdata?.phoneNumber || 'Add Phone Number',
        address: userdata?.address || 'Add Address'
    });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('profilePhoto', file);
                const response = await profilePhoto({body: formData}).unwrap();
                
                dispatch(updateUserField({
                    field: 'profilePhoto',
                    value: response.data.profilePhoto
                }));
            } catch (error) {
                console.error('Error updating profile photo:', error);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof typeof fieldValues, value: string) => {
        setFieldValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (field: keyof typeof fieldValues) => {
        const fieldToApiKeyMap = {
            name: 'userName',
            phone: 'phoneNumber',
            address: 'address'
        };

        try {
            const response = await updateProfile({
                [fieldToApiKeyMap[field]]: fieldValues[field]
            }).unwrap();

            dispatch(updateUserField({
                field: fieldToApiKeyMap[field],
                value: fieldValues[field]
            }));

            // Disable edit mode after successful save
            setEditMode(prev => ({
                ...prev,
                [field]: false
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className='flex justify-center items-center h-full p-10 m-2 w-full gap-[50px] p-8 bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-brown-500'>
            {/* Profile Card */}
            <div className="bg-white w-[350px] border-4 border-yellow-200 h-[500px] rounded-2xl shadow-4xl overflow-hidden transform transition-all duration-300 hover:scale-105">
                <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-[320px]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <img
                                className='w-[250px] h-[250px] object-cover rounded-full border-4 border-white shadow-lg'
                                src={userdata?.profilePhoto}
                                alt="profile"
                            />
                            <button
                                onClick={triggerFileInput}
                                className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                            >
                                <Camera className="text-white" size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-[50px] text-center px-6 pb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {fieldValues.name.toUpperCase()}
                    </h2>
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                        <Mail className="mr-2 w-5 h-5" />
                        <span>{userdata?.email || 'email@example.com'}</span>
                    </div>
                </div>
            </div>

            {/* Profile Details Edit */}
            <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile Details</h2>
                
                {/* Name Field */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-gray-600">Full Name</label>
                        <button 
                            onClick={() => editMode.name ? handleSave('name') : toggleEdit('name')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            {editMode.name ? <Save size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>
                    {editMode.name ? (
                        <input 
                            type="text"
                            value={fieldValues.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full border-b-2 border-blue-500 focus:outline-none py-2"
                        />
                    ) : (
                        <p className="text-xl font-medium">{fieldValues.name}</p>
                    )}
                </div>

                {/* Phone Field */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-gray-600">Phone Number</label>
                        <button 
                            onClick={() => editMode.phone ? handleSave('phone') : toggleEdit('phone')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            {editMode.phone ? <Save size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>
                    {editMode.phone ? (
                        <input 
                            type="text"
                            value={fieldValues.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full border-b-2 border-blue-500 focus:outline-none py-2"
                        />
                    ) : (
                        <p className="text-xl font-medium">{fieldValues.phone}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;