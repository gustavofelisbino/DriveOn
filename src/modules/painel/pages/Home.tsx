import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import DialogCarro from '../dialog/carro';
import DialogAgendamento from '../dialog/agendamento';
import { useNavigate } from 'react-router-dom';

// Mock inicial
const initialTasks = [
  { title: 'Troca de vela - Civic 2009', date: '19/07/2025 às 13:10' },
  { title: 'Amortecedor traseiro - Civic 2009', date: '03/07/2025 às 10:45' },
  { title: 'Revisão geral - Peugeot 208 2014', date: '02/07/2025 às 17:00' },
];

const initialCars = [
  'Chevrolet Astra - 2003',
  'Mitsubishi ASX - 2015',
  'Peugeot 208 - 2014',
];

const initialClients = ['Gustavo', 'Maria', 'Pedro'];

// Botão padrão estilizado
function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="contained"
      {...rest}
      sx={{
        borderRadius: 2.5,
        px: 2.5,
        py: 1,
        bgcolor: 'primary.main',
        color: 'white',
        fontWeight: 600,
        textTransform: 'none',
        fontSize: 13,
        boxShadow: 'none',
        '&:hover': {
          bgcolor: 'primary.dark',
          boxShadow: 'none',
        },
        ...sx,
      }}
    />
  );
}

// Card de seção
function SectionCard({
  title,
  icon,
  count,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        flex: 1,
        minWidth: 0,
      })}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Stack spacing={0.3}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {title}
              </Typography>
              {count !== undefined && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {count} {count === 1 ? 'item' : 'itens'}
                </Typography>
              )}
            </Stack>
          </Stack>
          {action}
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

// Linha de lista
function ListRow({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.25,
        px: 1.25,
        borderRadius: 2,
        '&:hover': {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 0.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12, lineHeight: 1.6 }}
            noWrap
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default function Home() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [cars, setCars] = React.useState(initialCars);
  const [clients, setClients] = React.useState(initialClients);
  const [openTask, setOpenTask] = React.useState(false);
  const [openCar, setOpenCar] = React.useState(false);
  const nav = useNavigate();

  const totalEntradas = 8650;
  const totalSaidas = 4870;
  const saldo = totalEntradas - totalSaidas;

  // limitar visualização a 4
  const visibleTasks = tasks.slice(0, 4);
  const visibleCars = cars.slice(0, 4);
  const visibleClients = clients.slice(0, 4);

  return (
    <Box
      sx={{
        maxWidth: 1600,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        py: { xs: 3, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        mb={{ xs: 3, md: 4 }}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 24, md: 28 } }}>
            Início
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral da sua oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton sx={{ bgcolor: 'action.hover' }}>
            <TrendingUpIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'action.hover' }}>
            <MoreHorizRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Cards Financeiros */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {/* Entradas */}
        <Paper
          elevation={0}
          sx={(t) => ({
            flex: 1,
            borderRadius: 2,
            p: 4,
            border: `1px solid ${t.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
          })}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) => alpha(t.palette.success.main, 0.1),
                color: 'success.main',
              }}
            >
              <ArrowDownwardRoundedIcon />
            </Box>
            <Stack>
              <Typography fontWeight={700}>Entradas</Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {totalEntradas.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Saídas */}
        <Paper
          elevation={0}
          sx={(t) => ({
            flex: 1,
            borderRadius: 2,
            p: 4,
            border: `1px solid ${t.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
          })}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                color: 'error.main',
              }}
            >
              <ArrowUpwardRoundedIcon />
            </Box>
            <Stack>
              <Typography fontWeight={700}>Saídas</Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {totalSaidas.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Saldo */}
        <Paper
          elevation={0}
          sx={(t) => ({
            flex: 1,
            borderRadius: 2,
            p: 4,
            border: `1px solid ${t.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
          })}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <AccountBalanceWalletOutlinedIcon />
            </Box>
            <Stack>
              <Typography fontWeight={700}>Saldo</Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {saldo.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      {/* Listas */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={{ xs: 2.5, md: 3 }}>
        {/* Atividades */}
        <SectionCard
          title="Atividades"
          icon={<AssignmentRoundedIcon />}
          count={tasks.length}
          action={
            <SoftButton onClick={() => setOpenTask(true)} startIcon={<AddRoundedIcon />}>
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {visibleTasks.map((t, i) => (
              <ListRow key={i} title={t.title} subtitle={t.date} />
            ))}
            {tasks.length > 4 && (
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                onClick={() => nav('/tarefas')}
              >
                Ver mais
              </Button>
            )}
          </Stack>
        </SectionCard>

        {/* Carros */}
        <SectionCard
          title="Carros cadastrados"
          icon={<DirectionsCarRoundedIcon />}
          count={cars.length}
          action={
            <SoftButton onClick={() => setOpenCar(true)} startIcon={<AddRoundedIcon />}>
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {visibleCars.map((c, i) => (
              <ListRow key={i} title={c} />
            ))}
            {cars.length > 4 && (
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                onClick={() => nav('/carros')}
              >
                Ver mais
              </Button>
            )}
          </Stack>
        </SectionCard>

        {/* Clientes */}
        <SectionCard
          title="Clientes"
          icon={<PersonOutlineIcon />}
          count={clients.length}
          action={
            <SoftButton onClick={() => setOpenClient(true)} startIcon={<AddRoundedIcon />}>
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {visibleClients.map((c, i) => (
              <ListRow key={i} title={c} />
            ))}
            {clients.length > 4 && (
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                onClick={() => nav('/clientes')}
              >
                Ver mais
              </Button>
            )}
          </Stack>
        </SectionCard>
      </Stack>

      {/* Diálogos */}
      <DialogAgendamento
        open={openTask}
        onClose={() => setOpenTask(false)}
        onCreate={(data) => {
          if (!data) return;
          const newTask = {
            title: data.title,
            date: data.dateTime
              ? data.dateTime.format('DD/MM/YYYY [às] HH:mm')
              : 'Sem data definida',
          };
          setTasks((prev) => [newTask, ...prev]);
          setOpenTask(false);
        }}
      />

      <DialogCarro
        open={openCar}
        onClose={() => setOpenCar(false)}
        onCreate={(data) => {
          if (!data) return;
          const newCar = `${data.brand} ${data.model} - ${data.year}`;
          setCars((prev) => [newCar, ...prev]);
          setOpenCar(false);
        }}
      />
    </Box>
  );
}
