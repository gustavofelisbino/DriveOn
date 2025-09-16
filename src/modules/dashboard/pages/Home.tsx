import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import DialogCarro, { type CarForm } from '../dialog/carro';
import DialogAgendamento, { type TaskForm } from '../dialog/agendamento';

// ---------------- Mock inicial ----------------
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

// --------------- UI helpers -------------------
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
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: (t) => t.palette.action.hover,
              color: 'text.primary',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0}>
            <Typography variant="subtitle1" fontWeight={800}>
              {title}
            </Typography>
            {!!count && (
              <Typography variant="caption" color="text.secondary">
                {count} {count === 1 ? 'item' : 'itens'}
              </Typography>
            )}
          </Stack>
        </Stack>
        {action}
      </Stack>

      <Divider sx={{ my: 2 }} />
      {children}
    </Paper>
  );
}

function ListRow({
  leading,
  title,
  subtitle,
  chip,
  onClick,
}: {
  leading: React.ReactNode;
  title: string;
  subtitle?: string;
  chip?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        px: 1,
        py: 1,
        borderRadius: 2,
        transition: 'background-color .15s ease, transform .12s ease',
        '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)' },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: (t) => t.palette.action.hover,
          color: 'text.primary',
          flexShrink: 0,
        }}
      >
        {leading}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={700} noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CalendarMonthRoundedIcon fontSize="inherit" style={{ opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          </Stack>
        )}
      </Box>

      {chip}

      <IconButton size="small" onClick={onClick}>
        <ChevronRightRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

// ---------------------- Página ----------------------
export default function Home() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [cars, setCars] = React.useState(initialCars);

  const [openTask, setOpenTask] = React.useState(false);
  const [openCar, setOpenCar] = React.useState(false);

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

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, md: 3, lg: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* Cabeçalho suave */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Stack spacing={0}>
          <Typography variant="h6" fontWeight={400}>
            Início
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumo rápido do seu dia na oficina
          </Typography>
        </Stack>

        <IconButton>
          <MoreHorizRoundedIcon />
        </IconButton>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Bloco: Tarefas */}
        <SectionCard
          title="Atividades pendentes"
          icon={<AssignmentRoundedIcon />}
          count={tasks.length}
          action={
            <Button
              onClick={() => setOpenTask(true)}
              startIcon={<AddRoundedIcon />}
              variant="contained"
              size="small"
              sx={{ borderRadius: 999 }}
            >
              Nova tarefa
            </Button>
          }
        >
          <Stack spacing={1}>
            {tasks.length === 0 && (
              <EmptyState
                icon={<AssignmentRoundedIcon color="disabled" />}
                text="Nenhuma tarefa por aqui"
                hint="Clique em “Nova tarefa” para começar"
              />
            )}

            {tasks.map((t, i) => (
              <ListRow
                key={i}
                leading={<AssignmentRoundedIcon fontSize="small" />}
                title={t.title}
                subtitle={t.date}
                chip={<Chip size="small" label="pendente" color="default" sx={{ borderRadius: 999 }} />}
              />
            ))}
          </Stack>
        </SectionCard>

        {/* Bloco: Carros */}
        <SectionCard
          title="Carros adicionados"
          icon={<DirectionsCarRoundedIcon />}
          count={cars.length}
          action={
            <Button
              onClick={() => setOpenCar(true)}
              startIcon={<AddRoundedIcon />}
              variant="contained"
              size="small"
              sx={{ borderRadius: 999 }}
            >
              Adicionar
            </Button>
          }
        >
          <Stack spacing={1}>
            {cars.length === 0 && (
              <EmptyState
                icon={<DirectionsCarRoundedIcon color="disabled" />}
                text="Nenhum carro cadastrado"
                hint="Use “Adicionar” para registrar um veículo"
              />
            )}

            {cars.map((c, i) => (
              <ListRow
                key={i}
                leading={<DirectionsCarRoundedIcon fontSize="small" />}
                title={c}
              />
            ))}
          </Stack>
        </SectionCard>
      </Stack>

      {/* Dialogs */}
      <DialogAgendamento
        open={openTask}
        onClose={() => setOpenTask(false)}
        onCreate={handleCreateTask}
      />
      <DialogCarro
        open={openCar}
        onClose={() => setOpenCar(false)}
        onCreate={handleCreateCar}
      />
    </Box>
  );
}

// --------- Empty state compacto ----------
function EmptyState({
  icon,
  text,
  hint,
}: {
  icon: React.ReactNode;
  text: string;
  hint?: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        py: 4,
        px: 2,
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={1} alignItems="center">
        {icon}
        <Typography fontWeight={700}>{text}</Typography>
        {hint && (
          <Typography variant="body2" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
