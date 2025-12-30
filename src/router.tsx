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
import RateChangePage from './pages/RateChangePage';



import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import NewServicePage from './pages/NewServicePage';
import EditServicePage from './pages/EditServicePage';// Layout
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
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance', 'manager']}>
            <Dashboard />
          </ProtectedRoute>
        ),
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
        path: 'services',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance', 'manager']}>
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/new',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <NewServicePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/:id',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance', 'manager']}>
            <ServiceDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <EditServicePage />
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
        path: 'payments',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <PaymentsPage />
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
      {
        path: 'rate-changes',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'finance']}>
            <RateChangePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);