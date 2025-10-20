import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Chip,
  Fade,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CircleIcon from '@mui/icons-material/Circle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DialogCarro, { type CarForm } from '../dialog/carro';
import DialogAgendamento, { type TaskForm } from '../dialog/agendamento';
import type { ClientForm } from '../../clients/dialog';

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

const initialClients = [
  'Gustavo',
  'Maria',
  'Pedro',
];

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
        boxShadow: (t) => `0 4px 14px ${alpha(t.palette.primary.main, 0.25)}`,
        transition: 'all 0.25s ease',
        '&:hover': {
          bgcolor: 'primary.dark',
          transform: 'translateY(-2px)',
          boxShadow: (t) => `0 6px 20px ${alpha(t.palette.primary.main, 0.35)}`,
        },
        ...sx,
      }}
    />
  );
}

function StatusDot({ color = 'warning.main', label = 'pendente' }) {
  return (
    <Chip
      icon={<CircleIcon sx={{ fontSize: 8, '&&': { ml: 1.5 } }} />}
      label={label}
      size="small"
      sx={{
        height: 24,
        bgcolor: (t) => alpha(t.palette[color.split('.')[0] as any].main, 0.12),
        color: color,
        border: (t) => `1px solid ${alpha(t.palette[color.split('.')[0] as any].main, 0.2)}`,
        fontWeight: 600,
        fontSize: 11,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
}

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
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          flex: 1,
          minWidth: 0,
          '&:hover': {
            boxShadow: (t) => `0 12px 40px ${alpha(t.palette.primary.main, 0.08)}`,
            borderColor: (t) => alpha(t.palette.primary.main, 0.3),
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Stack spacing={2.0}>
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
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(-5deg) scale(1.05)',
                  },
                }}
              >
                {icon}
              </Box>
              <Stack spacing={0.3}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                  {title}
                </Typography>
                {count !== undefined && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, fontWeight: 500 }}>
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
    </Fade>
  );
}

function ListRow({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.5,
        px: 1.5,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
          transform: 'translateX(4px)',
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
      {trailing}
    </Stack>
  );
}

function EmptyState({ icon, text, hint }: { icon: React.ReactNode; text: string; hint?: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        py: 4,
        px: 2,
        textAlign: 'center',
        bgcolor: (t) => alpha(t.palette.action.hover, 0.3),
        borderStyle: 'dashed',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1.2} alignItems="center">
        <Box sx={{ opacity: 0.5 }}>{icon}</Box>
        <Typography fontWeight={600} variant="body2">
          {text}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function Home() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [cars, setCars] = React.useState(initialCars);
  const [clients, setClients] = React.useState(initialClients);
  const [openTask, setOpenTask] = React.useState(false);
  const [openCar, setOpenCar] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);

  const handleCreateTask = (data: TaskForm) => {
    const newTask = {
      title: data.title,
      date: data.dateTime ? data.dateTime.format('DD/MM/YYYY [às] HH:mm') : '',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleCreateCar = (data: CarForm) => {
    const newCar = `${data.brand} ${data.model} - ${data.year}`;
    setCars((prev) => [newCar, ...prev]);
  };

  const handleCreateClient = (data: ClientForm) => {
    const newClient = `${data.name} ${data.lastName}`;
    setClients((prev) => [newClient, ...prev]);
  };

  const visibleTasks = tasks.slice(0, 5);
  const visibleCars = cars.slice(0, 5);
  const visibleClients = clients.slice(0, 5);

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
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
            Resumo rápido do seu dia na oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton 
            sx={{ 
              bgcolor: 'action.hover',
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: 'action.selected',
                transform: 'scale(1.05)',
              }
            }}
          >
            <TrendingUpIcon />
          </IconButton>
          <IconButton 
            sx={{ 
              bgcolor: 'action.hover',
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: 'action.selected',
                transform: 'scale(1.05)',
              }
            }}
          >
            <MoreHorizRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Cards Grid */}
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 2.5, md: 3 }}
        sx={{ alignItems: 'stretch' }}
      >
        {/* Atividades */}
        <SectionCard
          title="Atividades pendentes"
          icon={<AssignmentRoundedIcon />}
          count={tasks.length}
          action={
            <SoftButton
              onClick={() => setOpenTask(true)}
              startIcon={<AddRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {tasks.length === 0 && (
              <EmptyState
                icon={<AssignmentRoundedIcon sx={{ fontSize: 40 }} color="disabled" />}
                text="Nenhuma tarefa por aqui"
                hint="Clique em Adicionar para começar"
              />
            )}
            {visibleTasks.map((t, i) => (
              <ListRow key={i} title={t.title} subtitle={t.date} trailing={<StatusDot />} />
            ))}
          </Stack>
          {tasks.length > 0 && (
            <SoftButton
              onClick={() => setOpenTask(true)}
              startIcon={<AddRoundedIcon />}
              fullWidth
              sx={{ display: { sm: 'none' }, mt: 1 }}
            >
              Adicionar tarefa
            </SoftButton>
          )}
        </SectionCard>

        {/* Carros */}
        <SectionCard
          title="Carros cadastrados"
          icon={<DirectionsCarRoundedIcon />}
          count={cars.length}
          action={
            <SoftButton
              onClick={() => setOpenCar(true)}
              startIcon={<AddRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {cars.length === 0 && (
              <EmptyState
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 40 }} color="disabled" />}
                text="Nenhum carro cadastrado"
                hint="Use Adicionar para registrar um veículo"
              />
            )}
            {visibleCars.map((c, i) => (
              <ListRow key={i} title={c} />
            ))}
          </Stack>
          {cars.length > 0 && (
            <SoftButton
              onClick={() => setOpenCar(true)}
              startIcon={<AddRoundedIcon />}
              fullWidth
              sx={{ display: { sm: 'none' }, mt: 1 }}
            >
              Adicionar carro
            </SoftButton>
          )}
        </SectionCard>

        {/* Clientes */}
        <SectionCard
          title="Clientes"
          icon={<PersonOutlineIcon />}
          count={clients.length}
          action={
            <SoftButton
              onClick={() => setOpenClient(true)}
              startIcon={<AddRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Adicionar
            </SoftButton>
          }
        >
          <Stack spacing={0.5}>
            {clients.length === 0 && (
              <EmptyState
                icon={<PersonOutlineIcon sx={{ fontSize: 40 }} color="disabled" />}
                text="Nenhum cliente cadastrado"
                hint="Use Adicionar para registrar um cliente"
              />
            )}
            {visibleClients.map((c, i) => (
              <ListRow key={i} title={c} />
            ))}
          </Stack>
          {clients.length > 0 && (
            <SoftButton
              onClick={() => setOpenClient(true)}
              startIcon={<AddRoundedIcon />}
              fullWidth
              sx={{ display: { sm: 'none' }, mt: 1 }}
            >
              Adicionar cliente
            </SoftButton>
          )}
        </SectionCard>
      </Stack>

      {/* Dialogs */}
      <DialogAgendamento open={openTask} onClose={() => setOpenTask(false)} onCreate={handleCreateTask} />
      <DialogCarro open={openCar} onClose={() => setOpenCar(false)} onCreate={handleCreateCar} />
    </Box>
  );
}