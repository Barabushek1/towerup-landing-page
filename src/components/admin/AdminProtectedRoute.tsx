
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAdmin();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render admin layout with the outlet for nested routes
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminProtectedRoute;
