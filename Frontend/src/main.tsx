import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  
import { BrowserRouter } from 'react-router-dom';
import {store} from './store';  
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n'; 
import { LanguageProvider } from '../src/hooks/LanguageContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}> 
      <BrowserRouter> 
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ToastContainer />
            <App />
          </LanguageProvider>
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
