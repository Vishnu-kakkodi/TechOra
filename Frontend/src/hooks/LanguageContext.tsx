import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    // Priority: localStorage > browser language > default 'en'
    return localStorage.getItem('appLanguage') || 
           i18n.language || 
           'en';
  });

  const changeLanguage = (lang: string) => {
    // Update i18n instance
    i18n.changeLanguage(lang);
    
    // Update state
    setLanguage(lang);
    
    // Persist in localStorage
    localStorage.setItem('appLanguage', lang);
  };

  useEffect(() => {
    // Apply language on initial load and when it changes
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);