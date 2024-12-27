import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../hooks/LanguageContext';

interface LanguageSelectModalProps {
    setLanguageModalOpen: (open: boolean) => void;
}

const languages = [
    { code: 'en', name: 'english', flag: '🇬🇧' },
    { code: 'es', name: 'spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'french', flag: '🇫🇷' },
    { code: 'de', name: 'german', flag: '🇩🇪' },
    { code: 'hi', name: 'hindi', flag: '🇮🇳' },
  ];

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
    setLanguageModalOpen,
}) => {
    const { t } = useTranslation();
    const { language, changeLanguage } = useLanguage(); 

    const handleLanguageSelect = (languageCode: string) => {
        changeLanguage(languageCode); 
        setLanguageModalOpen(false);
    };

    return (
        <div className="container mx-auto">
            <Modal onClose={() => setLanguageModalOpen(false)}>
                <div className="w-[400px] p-8 bg-white shadow-lg mx-auto rounded-lg">
                    <h2 className="text-2xl mb-6 text-center font-bold text-black flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faGlobe} />
                        Select Your Language
                    </h2>

                    <div className="flex flex-col gap-4">
                        {languages.map((language: any) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageSelect(language.code)}
                                className={`flex items-center justify-start gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 ${language.code === language
                                        ? 'bg-yellow-300'
                                        : 'bg-white'
                                    }`}
                            >
                                <span className="text-2xl">{language.flag}</span>
                                <span className="text-lg text-black">{t(`languageSelect.languages.${language.name.toLowerCase()}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LanguageSelectModal;