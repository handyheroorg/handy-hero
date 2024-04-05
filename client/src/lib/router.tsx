import { createBrowserRouter } from 'react-router-dom'

import Root from '@/root'
import Error from '@/pages/error'
import Home from '@/pages/home'
import AuthLayout, { Login, Signup } from '@/pages/auth'
import Welcome from '@/pages/welcome'
import Settings, { BasicSettings } from '@/pages/settings'

export const router = createBrowserRouter([
  /** Authenticated App */
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <BasicSettings />,
          },
        ],
      },
    ],
  },
  /** Unauthenticated app */
  {
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'auth/login',
        element: <Login />,
      },
      {
        path: 'auth/signup',
        element: <Signup />,
      },
    ],
  },
])
