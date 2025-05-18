
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Staff: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Наша команда</h1>
        <p className="text-gray-400">
          Эта страница находится в разработке. Пожалуйста, вернитесь позже.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Staff;
