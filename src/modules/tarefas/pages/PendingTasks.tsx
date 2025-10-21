import * as React from 'react';
import {
  Box, Stack, Paper, Typography, TextField, InputAdornment, Button,
  IconButton, Tooltip, Divider, Chip, Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CircleIcon from '@mui/icons-material/Circle';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import {
  listarTarefas, obterTarefa, criarTarefa, atualizarTarefa, concluirTarefa, excluirTarefa
} from '../../../services/ordemservico';
import type {
  TaskCreateDto, TaskDetalhe, TaskListDto, TaskStatus, TaskUpdateDto
} from '../../../types/ordemservico';

import TaskDialog from '../dialog';

dayjs.locale('pt-br');

const fmtDate = (iso?: string | null) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : '—');

function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="text"
      {...rest}
      sx={{
        borderRadius: 999, px: 1.75, py: 0.75, fontWeight: 600, textTransform: 'none',
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main',
        '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
        ...sx,
      }}
    />
  );
}

function StatusChip({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { color: string; label: string }> = {
    pendente:     { color: 'warning.main', label: 'Pendente' },
    em_andamento: { color: 'info.main',    label: 'Em andamento' },
    concluida:    { color: 'success.main', label: 'Concluída' },
    cancelada:    { color: 'error.main',   label: 'Cancelada' },
  };
  const cfg = map[status];
  return (
    <Chip
      size="small"
      label={<Stack direction="row" spacing={1} alignItems="center">
        <CircleIcon sx={{ fontSize: 8, color: cfg.color }} />
        <span>{cfg.label}</span>
      </Stack>}
      sx={{ borderRadius: 999, bgcolor: (t) => alpha(t.palette.text.primary, 0.06), '& .MuiChip-label': { px: 1 } }}
    />
  );
}

function PriorityChip({ p }: { p: 'baixa' | 'media' | 'alta' }) {
  const map = {
    baixa: { color: 'success.main', label: 'Baixa' },
    media: { color: 'warning.main', label: 'Média' },
    alta:  { color: 'error.main',   label: 'Alta' },
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

function isOverdue(iso?: string | null) {
  return !!iso && dayjs(iso).isBefore(dayjs());
}

function TaskPill({
  t, onView, onEdit, onComplete, onDelete, disabled
}: {
  t: TaskListDto;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}) {
  return (
    <Paper elevation={0} sx={{
      px: 2, py: 1.25, borderRadius: 2,
      border: (th) => `1px solid ${alpha(th.palette.text.primary, 0.18)}`,
      bgcolor: 'background.paper',
      transition: 'transform .12s ease, background-color .15s ease, border-color .15s ease',
      '&:hover': { transform: 'translateY(-1px)', borderColor: (t) => alpha(t.palette.primary.main, 0.35), bgcolor: (t) => alpha(t.palette.primary.main, 0.03) },
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 260 }} noWrap>
          {t.titulo}
        </Typography>

        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 280, flex: 1 }}>
          <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
          <Typography variant="body2" color={isOverdue(t.venceEm) ? 'error.main' : 'text.secondary'} noWrap>
            {t.venceEm ? fmtDate(t.venceEm) : 'Sem vencimento'}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {t.ordemServicoId ? `OS #${t.ordemServicoId}` : '—'} • {t.clienteId ? `Cliente #${t.clienteId}` : '—'}
          </Typography>
        </Stack>

        <PriorityChip p={t.prioridade} />
        <StatusChip status={t.status} />

        <Divider orientation="vertical" flexItem sx={{ mx: 1.25, my: 0.5 }} />

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => onView(t.id)} disabled={disabled}>
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {t.status !== 'concluida' && t.status !== 'cancelada' && (
            <Tooltip title="Concluir tarefa">
              <IconButton size="small" onClick={() => onComplete(t.id)} disabled={disabled}>
                <CheckCircleRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => onDelete(t.id)} disabled={disabled}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

function Filters({
  status, onStatusChange, due, onDueChange
}: {
  status: 'todas' | TaskStatus;
  onStatusChange: (v: 'todas' | TaskStatus) => void;
  due: 'todas' | 'overdue' | 'today' | 'week' | 'month';
  onDueChange: (v: 'todas' | 'overdue' | 'today' | 'week' | 'month') => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  return (
    <>
      <Button variant="outlined" onClick={(e) => setAnchor(e.currentTarget)} startIcon={<TuneRoundedIcon />} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}>
        {status === 'todas' && due === 'todas' ? 'Filtros' : `Status: ${status} • Prazo: ${due}`}
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <MenuItem disabled>— Status —</MenuItem>
        <MenuItem onClick={() => { onStatusChange('todas'); }}>Todas</MenuItem>
        <MenuItem onClick={() => { onStatusChange('pendente'); }}>Pendentes</MenuItem>
        <MenuItem onClick={() => { onStatusChange('em_andamento'); }}>Em andamento</MenuItem>
        <MenuItem onClick={() => { onStatusChange('concluida'); }}>Concluídas</MenuItem>
        <MenuItem onClick={() => { onStatusChange('cancelada'); }}>Canceladas</MenuItem>
        <Divider />
        <MenuItem disabled>— Prazo —</MenuItem>
        <MenuItem onClick={() => { onDueChange('todas'); }}>Todas</MenuItem>
        <MenuItem onClick={() => { onDueChange('overdue'); }}>Vencidas</MenuItem>
        <MenuItem onClick={() => { onDueChange('today'); }}>Hoje</MenuItem>
        <MenuItem onClick={() => { onDueChange('week'); }}>Essa semana</MenuItem>
        <MenuItem onClick={() => { onDueChange('month'); }}>Este mês</MenuItem>
      </Menu>
    </>
  );
}

export default function PendingTasks() {
  const [rows, setRows] = React.useState<TaskListDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState<'todas' | TaskStatus>('todas');
  const [due, setDue] = React.useState<'todas' | 'overdue' | 'today' | 'week' | 'month'>('todas');

  // dialog
  const [dlgOpen, setDlgOpen] = React.useState(false);
  const [dlgMode, setDlgMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [detail, setDetail] = React.useState<TaskDetalhe | null>(null);

  // feedback
  const [busyId, setBusyId] = React.useState<number | null>(null);
  const [toast, setToast] = React.useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({ open: false, msg: '', sev: 'success' });

  const notify = (msg: string, sev: 'success' | 'error' = 'success') => setToast({ open: true, msg, sev });

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarTarefas({
        status,
        q: q.trim() || undefined,
        due: due === 'todas' ? undefined : due,
      });
      setRows(data);
    } catch (e: any) {
      notify(e?.message ?? 'Falha ao carregar tarefas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [status, q, due]);

  React.useEffect(() => { fetchList(); }, [fetchList]);

  const openCreate = () => { setDlgMode('create'); setDetail(null); setDlgOpen(true); };

  const openView = async (id: number) => {
    try {
      const data = await obterTarefa(id);
      setDetail(data);
      setDlgMode('view');
      setDlgOpen(true);
    } catch (e: any) {
      notify(e?.message ?? 'Não foi possível abrir a tarefa.', 'error');
    }
  };

  const openEdit = async (id: number) => {
    try {
      const data = await obterTarefa(id);
      setDetail(data);
      setDlgMode('edit');
      setDlgOpen(true);
    } catch (e: any) {
      notify(e?.message ?? 'Não foi possível carregar a tarefa.', 'error');
    }
  };

  const handleCreate = async (dto: TaskCreateDto) => {
    try {
      await criarTarefa(dto);
      notify('Tarefa criada com sucesso!');
      await fetchList();
    } catch (e: any) {
      notify(e?.message ?? 'Falha ao criar tarefa.', 'error');
      throw e;
    }
  };

  const handleUpdate = async (dto: TaskUpdateDto) => {
    if (!detail) return;
    try {
      setBusyId(detail.id);
      await atualizarTarefa(detail.id, dto);
      notify('Tarefa atualizada.');
      await fetchList();
    } catch (e: any) {
      notify(e?.message ?? 'Falha ao atualizar tarefa.', 'error');
      throw e;
    } finally {
      setBusyId(null);
    }
  };

  const completeTask = async (id: number) => {
    try {
      setBusyId(id);
      await concluirTarefa(id);
      notify('Tarefa concluída!');
      await fetchList();
      if (detail?.id === id) {
        const data = await obterTarefa(id);
        setDetail(data);
      }
    } catch (e: any) {
      notify(e?.message ?? 'Falha ao concluir tarefa.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm(`Excluir a tarefa #${id}?`)) return;
    try {
      setBusyId(id);
      await excluirTarefa(id);
      notify('Tarefa excluída.');
      await fetchList();
      if (detail?.id === id) setDlgOpen(false);
    } catch (e: any) {
      notify(e?.message ?? 'Falha ao excluir tarefa.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = rows.filter((t) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      String(t.id).includes(term) ||
      t.titulo.toLowerCase().includes(term) ||
      (t.ordemServicoId ? String(t.ordemServicoId).includes(term) : false) ||
      (t.clienteId ? String(t.clienteId).includes(term) : false) ||
      t.status.includes(term)
    );
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4, lg: 6 }, py: { xs: 2, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={700}>Tarefas</Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por título, #tarefa, #OS, #cliente ou status"
            size="small"
            sx={{ minWidth: { xs: '100%', md: 360 }, '& .MuiOutlinedInput-root': { borderRadius: 999, bgcolor: 'background.paper' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
          <SoftButton startIcon={<AddRoundedIcon />} onClick={openCreate}>Nova tarefa</SoftButton>
          <Filters status={status} onStatusChange={setStatus} due={due} onDueChange={setDue} />
        </Stack>
      </Stack>

      {loading && <Paper variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>Carregando…</Paper>}

      {!loading && filtered.length === 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: 'center', bgcolor: (t) => alpha(t.palette.primary.main, 0.02) }}>
          <Typography fontWeight={600}>Nenhuma tarefa encontrada</Typography>
          <Typography variant="body2" color="text.secondary">Ajuste a busca/filtros ou crie uma nova tarefa.</Typography>
        </Paper>
      )}

      <Stack spacing={1.25}>
        {filtered.map((t) => (
          <TaskPill
            key={t.id}
            t={t}
            onView={openView}
            onEdit={openEdit}
            onComplete={completeTask}
            onDelete={deleteTask}
            disabled={busyId === t.id}
          />
        ))}
      </Stack>

      <TaskDialog
        open={dlgOpen}
        mode={dlgMode}
        detail={detail}
        onClose={() => setDlgOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
