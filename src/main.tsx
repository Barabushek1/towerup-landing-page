
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AdminProvider } from './contexts/AdminContext.tsx'
import { AdminDataProvider } from './contexts/AdminDataContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AdminProvider>
    <AdminDataProvider>
      <App />
    </AdminDataProvider>
  </AdminProvider>
);
