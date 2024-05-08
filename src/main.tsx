import React from 'react';

import { createHashRouter, RouterProvider } from 'react-router-dom';

import ReactDOM from 'react-dom/client';

import Svg from './routes/Svg';
import Webp from './routes/Webp';
import Compress from './routes/Compress';

import './index.css';

const router = createHashRouter([
  {
    path: "/",
    element: <Svg />,
  },
  {
    path: "/webp",
    element: <Webp />,
  },
  {
    path: "/compress",
    element: <Compress />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
