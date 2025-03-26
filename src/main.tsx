
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AdminProvider } from './contexts/AdminContext.tsx'
import { AdminDataProvider } from './contexts/AdminDataContext.tsx'
import { BrowserRouter } from 'react-router-dom'

// Enable handling of sub-paths for Vercel deployment
const basename = import.meta.env.BASE_URL || "/"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <AdminProvider>
      <AdminDataProvider>
        <App />
      </AdminDataProvider>
    </AdminProvider>
  </BrowserRouter>
);
