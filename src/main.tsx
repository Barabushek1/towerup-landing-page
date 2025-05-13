
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './fonts.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AdminProvider } from '@/contexts/AdminContext';
import { AdminDataProvider } from '@/contexts/AdminDataContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useTenderSeeder } from './hooks/use-tender-seeder.tsx';
import { HelmetProvider } from 'react-helmet-async';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Create a Provider component that includes all providers
const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTenderSeeder();
  
  return children;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <LanguageProvider>
            <AdminProvider>
              <AdminDataProvider>
                <HelmetProvider>
                  <ProvidersWrapper>
                    <App />
                  </ProvidersWrapper>
                </HelmetProvider>
              </AdminDataProvider>
            </AdminProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
