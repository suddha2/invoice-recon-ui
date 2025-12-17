import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { UserRole } from './lib/types/auth';

// Pages (we'll create these next)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
import InvoicesPage from './pages/InvoicesPage';
import ReconciliationPage from './pages/ReconciliationPage';

// Layout
import Layout from '@/components/layout/Layout';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { isAuthenticated, hasPermission } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasPermission(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'contracts',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance', 'manager']}>
            <ContractsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payments',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <PaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoices',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <InvoicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reconciliation',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <ReconciliationPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);