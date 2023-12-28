import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';
import { LanguageEnum } from '@clamcurry/common';

const initI18next = (language: LanguageEnum) => {
    return i18next.use(initReactI18next).init({
        resources,
        fallbackLng: 'en_US',
        lng: language,
        interpolation: {
            escapeValue: false,
        },
    });
};

export default initI18next;
