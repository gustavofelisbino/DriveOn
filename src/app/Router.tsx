import { Routes, Route, Navigate } from 'react-router-dom';
import { paths } from '../routes/paths';
import AppLayout from './AppLayout';
import Login from '../modules/autenticacao/pages/Login';
import Home from '../modules/painel/pages/Home';
import Schedule from '../modules/agenda/pages/Schedule';
import Clients from '../modules/clientes/pages/Clientes';
import PendingTasks from '../modules/tarefas/pages/PendingTasks';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';
import Extrato from '../modules/pagamentos/pages/extrato/payments';
import ContasPagar from '../modules/pagamentos/pages/contaspagar/contaspagar';
import ContasReceber from '../modules/pagamentos/pages/contasreceber/contasreceber';
import UserPage from '../modules/usuarios/pages/UserForm';
import ClientDetails from '../modules/clientes/pages/detalhesclientes/detalhesclientes';

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
        <Route path={paths.payments} element={<Extrato />} />
        <Route path={paths.contasPagar} element={<ContasPagar />} />
        <Route path={paths.contasReceber} element={<ContasReceber />} />
        <Route path={paths.users} element={<UserPage />} />
        <Route path={paths.clientDetails} element={<ClientDetails />} />
      </Route>
    </Routes>
  );
}
