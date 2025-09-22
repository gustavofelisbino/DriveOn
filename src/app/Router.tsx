import { Routes, Route, Navigate } from 'react-router-dom';
import { paths } from '../routes/paths';
import AppLayout from './AppLayout';
import Login from '../modules/auth/pages/Login';
import Home from '../modules/dashboard/pages/Home';
import Schedule from '../modules/schedule/pages/Schedule';
import Clients from '../modules/clients/pages/Clientes';
import PendingTasks from '../modules/tasks/pages/PendingTasks';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';
import Payments from '../modules/payments/pages/Payments';
import UserPage from '../modules/users/pages/UserForm';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={paths.login} replace />;
}

export default function Router() {
  return (
    <Routes>
      <Route path={paths.login} element={<Login />} />
      <Route
        path={paths.root}
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path={paths.agenda} element={<Schedule />} />
        <Route path={paths.clients} element={<Clients />} />
        <Route path={paths.tasks} element={<PendingTasks />} />
        <Route path={paths.payments} element={<Payments />} />
        <Route path={paths.users} element={<UserPage />} />
      </Route>
    </Routes>
  );
}
