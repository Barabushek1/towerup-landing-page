
import React from 'react';

const AdminLoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh] bg-gray-900 bg-opacity-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-200">Загрузка...</p>
      </div>
    </div>
  );
};

export default AdminLoadingScreen;
