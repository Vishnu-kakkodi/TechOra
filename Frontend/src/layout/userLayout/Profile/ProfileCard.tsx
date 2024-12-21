import React from 'react';
import { Camera, Mail } from 'lucide-react';

interface ProfileCardProps {
    name: string;
    email: string;
    profilePhoto: string | undefined;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    triggerFileInput: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    email,
    profilePhoto,
    onImageUpload,
    triggerFileInput,
    fileInputRef
}) => {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
            <div className="relative inline-block">
                <img
                    className="w-48 h-48 rounded-full border-4 border-white shadow-lg mx-auto mb-4"
                    src={profilePhoto || '/placeholder.svg?height=200&width=200'}
                    alt="Profile"
                />
                <button
                    onClick={triggerFileInput}
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <Camera className="text-blue-500" size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{name.toUpperCase()}</h2>
            <div className="flex items-center justify-center text-white mb-4">
                <Mail className="mr-2 w-5 h-5" />
                <span>{email}</span>
            </div>
        </div>
    );
};

export default ProfileCard;

