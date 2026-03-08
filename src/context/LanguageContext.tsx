import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../utils/i18n';
import storage from '../utils/storage';

interface LanguageContextType {
    locale: string;
    changeLanguage: (lang: string) => Promise<void>;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        const savedLang = await storage.get(storage.KEYS.LANGUAGE);
        if (savedLang) {
            setLocale(savedLang);
            i18n.locale = savedLang;
        }
    };

    const changeLanguage = async (lang: string) => {
        setLocale(lang);
        i18n.locale = lang;
        await storage.set(storage.KEYS.LANGUAGE, lang);
    };

    const t = (key: string) => i18n.t(key);

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}

export default LanguageContext;