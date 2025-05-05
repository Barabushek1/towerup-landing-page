
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import './fonts.css';
import { AdminProvider } from './contexts/AdminContext';
import { AdminDataProvider } from './contexts/AdminDataContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,                  // Only retry once by default
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <AdminDataProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AdminDataProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
