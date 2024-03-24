import { createBrowserRouter } from 'react-router-dom'

import Root from '@/root'
import Error from '@/pages/error'
import Home from '@/pages/home'
import AuthLayout, { Login, Signup } from '@/pages/auth'

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
