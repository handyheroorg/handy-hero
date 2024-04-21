import { createBrowserRouter } from 'react-router-dom'

import Root from '@/root'
import Error from '@/pages/error'
import Home from '@/pages/home'
import AuthLayout, { Login, Signup } from '@/pages/auth'
import Welcome from '@/pages/welcome'
import Settings, { BasicSettings, Profile } from '@/pages/settings'
import { roleGuard } from './guard'
import { Role } from '@/types'
import ProviderDashboard from '@/pages/provider-dashboard'
import { CreateService, EditService, FindServices, ServiceDetails } from '@/pages/services'
import { ChatRequests, ChatRoom } from '@/pages/chat'
import ClientDashboard from '@/pages/client-dashboard'
import { ContractDetails } from '@/pages/contract'

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
          {
            path: '/settings/profile',
            element: <Profile />,
            loader: () => roleGuard([Role.SERVICE_PROVIDER]),
          },
        ],
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '/dashboard/provider',
            element: <ProviderDashboard />,
            loader: () => roleGuard([Role.SERVICE_PROVIDER]),
          },
          {
            path: '/dashboard/client',
            element: <ClientDashboard />,
            loader: () => roleGuard([Role.CLIENT]),
          },
        ],
      },
      {
        path: 'services',
        children: [
          {
            path: '/services/new',
            element: <CreateService />,
            loader: () => roleGuard([Role.SERVICE_PROVIDER]),
          },
          {
            path: '/services/:id/edit',
            element: <EditService />,
            loader: () => roleGuard([Role.SERVICE_PROVIDER]),
          },
          {
            path: '/services/:id',
            element: <ServiceDetails />,
            loader: () => roleGuard([Role.SERVICE_PROVIDER, Role.CLIENT]),
          },
          {
            path: '/services/find',
            element: <FindServices />,
            loader: () => roleGuard([Role.CLIENT]),
          },
        ],
      },
      {
        path: 'chat',
        children: [
          {
            path: '/chat/requests',
            element: <ChatRequests />,
          },
          {
            path: '/chat/room/:id',
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: 'contract',
        children: [
          {
            path: '/contract/:id',
            element: <ContractDetails />,
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
