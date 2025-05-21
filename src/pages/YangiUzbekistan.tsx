
import React from 'react';
import { Helmet } from 'react-helmet-async';

const YangiUzbekistan: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Yangi Uzbekistan | TOWER UP</title>
      </Helmet>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-6">Yangi Uzbekistan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-8">
          Информация о проекте Yangi Uzbekistan будет доступна в ближайшее время.
        </p>
      </div>
    </>
  );
};

export default YangiUzbekistan;
