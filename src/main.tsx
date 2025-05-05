
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './fonts.css';
import { AdminProvider } from './contexts/AdminContext';
import { AdminDataProvider } from './contexts/AdminDataContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <AdminDataProvider>
          <App />
        </AdminDataProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
