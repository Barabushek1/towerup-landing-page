
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Construction } from 'lucide-react';

const UnderConstruction: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Страница в разработке | TOWER UP</title>
      </Helmet>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Construction className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Страница в разработке</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
          Мы работаем над этой страницей. Пожалуйста, проверьте позже.
        </p>
        <a 
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          Вернуться на главную
        </a>
      </div>
    </>
  );
};

export default UnderConstruction;
