import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Layout from '../layouts/Layout.js';
import HomePage from '../pages/HomePage.js';
import LandingPage from '../pages/LandingPage.js';
import NotFoundPage from '../pages/NotFoundPage.js';
import Test from '@/pages/Test.js';
import BlogPage from '@/pages/BlogPage.js';
import Inventory from '@/pages/Inventory.js';
import Lobby from '@/pages/Lobby.js';

const routes: RouteObject[] = [
  {
    // public routes
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { element: <LandingPage />, index: true },
      { element: <HomePage />, path: '/home' },
      { element: <Test />, path: '/test' },
      { element: <BlogPage />, path: '/blog' },
      { element: <Lobby />, path: '/lobby' },
      { element: <Inventory />, path: '/inventory' },

      //   { action: handleLogin, element: <LoginForm />, path: '/login' },
      //            { path: "/signup", element: <SignupPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;
