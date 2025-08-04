import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectsListPage from './pages/ProjectsListPage';
import Dragflow from './Dragflow/Dragflow';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProjectsListPage />,
  },
  {
    path: '/create',
    element: <CreateProjectPage />,
  },
  {
    path: '/project/:projectId',
    element:<div style={{ width: '100vw', height: '100vh' }}>
      <Dragflow />
    </div>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
