
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const FloorPrices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <>
      <Helmet>
        <title>Цены по этажам | TOWER UP</title>
      </Helmet>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-6">Цены по этажам</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-4">
          ID проекта: {id}
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
          Информация о ценах по этажам будет доступна в ближайшее время.
        </p>
      </div>
    </>
  );
};

export default FloorPrices;
