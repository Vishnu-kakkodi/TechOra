
import React, { useRef, useState } from 'react';
import { Camera, Mail, Edit2, Save, Phone, MapPin } from 'lucide-react';
import { useAppSelector } from '../../../store/hook';
import { updateUserField } from '../../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import ProfileCard from './ProfileCard';
import EditableField from './EditableField';
import { useProfilePhotoMutation, useUpdateProfileMutation } from '../../../store/slices/userSlice';
import { toast } from 'react-toastify';

const Profile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userdata = useAppSelector((state) => state.auth.userInfo);
    const [profilePhoto] = useProfilePhotoMutation();
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch();

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
                toast.success(response.message)           
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

    const handleSave = async (field: keyof typeof fieldValues, value: string) => {
        const fieldToApiKeyMap = {
            name: 'userName',
            phone: 'phoneNumber',
            address: 'address'
        };

        try {
            const response = await updateProfile({
                [fieldToApiKeyMap[field]]: value
            }).unwrap();

            toast.success(response.message)

            dispatch(updateUserField({
                field: fieldToApiKeyMap[field],
                value: value
            }));

            setFieldValues(prev => ({
                ...prev,
                [field]: value
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3">
                            <ProfileCard
                                name={fieldValues.name}
                                email={userdata?.email || 'email@example.com'}
                                profilePhoto={userdata?.profilePhoto}
                                onImageUpload={handleImageUpload}
                                triggerFileInput={triggerFileInput}
                                fileInputRef={fileInputRef}
                            />
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile Details</h2>
                            <div className="space-y-6">
                                <EditableField
                                    label="Full Name"
                                    value={fieldValues.name}
                                    onSave={(value) => handleSave('name', value)}
                                    icon={<Edit2 size={20} />}
                                />
                                <EditableField
                                    label="Phone Number"
                                    value={fieldValues.phone}
                                    onSave={(value) => handleSave('phone', value)}
                                    icon={<Phone size={20} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

