import { createBrowserRouter } from 'react-router-dom'

import Root from '@/root'
import Error from '@/pages/error'
import Home from '@/pages/home'
import AuthLayout, { Login, Signup } from '@/pages/auth'

const router = createBrowserRouter([
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
        element: <AuthLayout />,
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
    ],
  },
])

export default router
