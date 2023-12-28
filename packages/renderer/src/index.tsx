import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import initI18next from './i18n';
import ThemeProvider from './components/ThemeProvider';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

window.preferenceService
    .find()
    .then(async (preference) => {
        // set rem base value
        document.documentElement.style.fontSize = `${preference.fontSize}px`;
        await initI18next(preference.language);
        return preference;
    })
    .then((preference) => {
        root.render(
            <React.StrictMode>
                <Provider store={store}>
                    <ThemeProvider initialTheme={preference.theme}>
                        <App preference={preference} />
                    </ThemeProvider>
                </Provider>
            </React.StrictMode>,
        );
    });
