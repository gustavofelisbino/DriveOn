import * as React from 'react';
import {
  Box, Stack, Paper, Typography, TextField, InputAdornment, Button,
  IconButton, Chip, Divider, Menu, MenuItem
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CircleIcon from '@mui/icons-material/Circle';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import TaskDialog from '../dialog';
dayjs.locale('pt-br');

type Task = {
  id: number;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  venceEm?: string;
  ordemServico?: string;
  cliente?: string;
};

const mockTasks: Task[] = [
  { id: 1, titulo: 'Troca de óleo - Civic 2009', prioridade: 'media', status: 'pendente', venceEm: '2025-10-25', ordemServico: '#145', cliente: 'João Silva' },
  { id: 2, titulo: 'Revisão completa - Peugeot 208', prioridade: 'alta', status: 'em_andamento', venceEm: '2025-10-20', ordemServico: '#141', cliente: 'Maria Santos' },
  { id: 3, titulo: 'Troca de pastilhas de freio', prioridade: 'baixa', status: 'concluida', venceEm: '2025-10-10', ordemServico: '#139', cliente: 'Pedro Costa' },
];

function StatusChip({ status }: { status: Task['status'] }) {
  const map = {
    pendente: { color: 'warning.main', label: 'Pendente' },
    em_andamento: { color: 'info.main', label: 'Em andamento' },
    concluida: { color: 'success.main', label: 'Concluída' },
    cancelada: { color: 'error.main', label: 'Cancelada' },
  } as const;
  const cfg = map[status];
  return (
    <Chip
      size="small"
      label={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CircleIcon sx={{ fontSize: 8, color: cfg.color }} />
          <span>{cfg.label}</span>
        </Stack>
      }
      sx={{
        height: 24,
        borderRadius: 999,
        bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

function PriorityChip({ p }: { p: Task['prioridade'] }) {
  const map = {
    baixa: { color: 'success.main', label: 'Baixa' },
    media: { color: 'warning.main', label: 'Média' },
    alta: { color: 'error.main', label: 'Alta' },
  } as const;
  const cfg = map[p];
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        height: 24,
        borderRadius: 999,
        bgcolor: (t) => alpha((t.palette as any)[cfg.color.split('.')[0]].main, 0.08),
        color: cfg.color,
        fontWeight: 700,
      }}
    />
  );
}

function TaskCard({
  task,
  onEdit,
  onComplete,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const vencida = task.venceEm && dayjs(task.venceEm).isBefore(dayjs());

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap>
            {task.titulo}
          </Typography>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ color: 'text.secondary' }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
            <Typography variant="caption" color={vencida ? 'error.main' : 'text.secondary'}>
              {task.venceEm ? dayjs(task.venceEm).format('DD/MM/YYYY') : 'Sem vencimento'}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {task.ordemServico ?? '—'} • {task.cliente ?? '—'}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <PriorityChip p={task.prioridade} />
          <StatusChip status={task.status} />
        </Stack>

        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          PaperProps={{
            sx: { mt: 1, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` },
          }}
        >
          <MenuItem onClick={() => { setAnchor(null); onEdit(task); }}>Editar</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onComplete(task.id); }}>Marcar como concluída</MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); onDelete(task.id); }} sx={{ color: 'error.main' }}>
            Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [query, setQuery] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const filtered = tasks.filter((t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      t.titulo.toLowerCase().includes(q) ||
      t.cliente?.toLowerCase().includes(q) ||
      t.ordemServico?.toLowerCase().includes(q)
    );
  });

  const handleAdd = () => {
    setDialogMode('create');
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setDialogMode('edit');
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleComplete = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'concluida' } : t))
    );

  const handleDelete = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleCreate = (dto: any) => {
    const newTask: Task = {
      id: tasks.length + 1,
      titulo: dto.titulo,
      descricao: dto.descricao,
      prioridade: dto.prioridade,
      status: 'pendente',
      venceEm: dto.venceEm,
      cliente: 'Novo cliente',
      ordemServico: '#999',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdate = (dto: any) => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, ...dto } : t))
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>Tarefas</Typography>
          <Typography variant="body2" color="text.secondary">Gerencie as tarefas da sua oficina</Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar tarefas"
            size="small"
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAdd}
            sx={{ borderRadius: 2 }}
          >
            Nova tarefa
          </Button>
        </Stack>
      </Stack>

      {filtered.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: 5,
            textAlign: 'center',
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          }}
        >
          <Typography fontWeight={600}>Nenhuma tarefa encontrada</Typography>
          <Typography variant="body2" color="text.secondary">
            Ajuste a pesquisa ou adicione uma nova tarefa.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.25}>
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={handleEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      <TaskDialog
        open={dialogOpen}
        mode={dialogMode}
        detail={
          selectedTask
            ? {
                id: selectedTask.id,
                titulo: selectedTask.titulo,
                descricao: selectedTask.descricao,
                prioridade: selectedTask.prioridade,
                status: selectedTask.status,
                venceEm: selectedTask.venceEm,
                ordemServicoId: selectedTask.ordemServico ? 1 : undefined,
                clienteId: selectedTask.cliente ? 1 : undefined,
              }
            : undefined
        }
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </Box>
  );
}
