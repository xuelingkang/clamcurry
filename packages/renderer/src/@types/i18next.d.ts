import 'i18next';
import resources from '@/i18n/resources';

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: typeof resources.en_US;
    }
}
