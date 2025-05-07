import React, { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Vacancies from './pages/Vacancies';
import News from './pages/News';
import NewsItem from './pages/NewsItem';
import Partners from './pages/Partners';
import Messages from './pages/Messages';
import Projects from './pages/Projects';
import BankingTechnology from './pages/BankingTechnology';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/vacancies",
    element: <Vacancies />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/news/:id",
    element: <NewsItem />,
  },
  {
    path: "/partners",
    element: <Partners />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/banking-technology",
    element: <BankingTechnology />
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
