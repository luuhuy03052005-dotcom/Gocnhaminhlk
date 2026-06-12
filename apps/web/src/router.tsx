import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/portal/LoginPage';
import { ProfilePage } from './pages/portal/ProfilePage';
import { VoucherWalletPage } from './pages/portal/VoucherWalletPage';
import { NotificationPage } from './pages/portal/NotificationPage';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/portal',
    children: [
      {
        index: true,
        element: <Navigate to="/portal/profile" replace />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <PortalLayout>
              <ProfilePage />
            </PortalLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'vouchers',
        element: (
          <ProtectedRoute>
            <PortalLayout>
              <VoucherWalletPage />
            </PortalLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <PortalLayout>
              <NotificationPage />
            </PortalLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

import { PortalHeader } from './components/portal/PortalHeader';

function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <PortalHeader />
      {children}
    </div>
  );
}
