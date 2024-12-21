import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface EditableFieldProps {
    label: string;
    value: string;
    onSave: (value: string) => void;
    icon: React.ReactNode;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave, icon }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);

    const handleSave = () => {
        onSave(fieldValue);
        setIsEditing(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-gray-600 font-medium">{label}</label>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                    {isEditing ? <Save size={20} /> : icon}
                </button>
            </div>
            {isEditing ? (
                <input 
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    className="w-full border-b-2 border-blue-500 focus:outline-none py-2 bg-gray-50"
                />
            ) : (
                <p className="text-xl font-medium text-gray-800">{fieldValue}</p>
            )}
        </div>
    );
};

export default EditableField;

