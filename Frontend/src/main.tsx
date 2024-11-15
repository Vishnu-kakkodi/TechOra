import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import {store} from './store';  
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}> 
      <BrowserRouter> 
      <ToastContainer />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
