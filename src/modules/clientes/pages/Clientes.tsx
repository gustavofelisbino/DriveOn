import * as React from 'react';
import {
  Box, Stack, Typography, TextField, InputAdornment,
  Button, IconButton, Paper, Chip, Avatar, Tooltip, Menu, MenuItem, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import ClientDialog, { type Client, type ClientForm } from './../dialog';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import { useClients } from '../../../context/ClientContext';

const genId = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const normalizePhoneView = (s?: string) => {
  const digits = (s || '').replace(/[^\d]/g, '');
  if (!digits) return '—';
  if (digits.length <= 10)
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{0,4})$/, '$1-$2');
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{0,4})$/, '$1-$2');
};
const seed: Client[] = [
  { id: genId(), name: 'Gustavo', email: 'gustavo@exemplo.com', phone: '11987654321', model: 'Peugeot 208', year: 2015, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/01.png' },
  { id: genId(), name: 'Lucas',   email: 'lucas@exemplo.com',   phone: '11999990000', model: 'Mitsubishi ASX', year: 2015, plan: 'Trial',     createdAt: new Date().toISOString(), avatar: '/images/avatars/02.png' },
  { id: genId(), name: 'Vitor',   email: 'vitor@exemplo.com',   phone: '11912344321', model: 'Fiat Uno',       year: 2012, plan: 'Inactive',  createdAt: new Date().toISOString(), avatar: '/images/avatars/04.png' },
];
function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="text"
      {...rest}
      sx={{
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        fontWeight: 600,
        textTransform: 'none',
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
        color: 'primary.main',
        '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
        ...sx,
      }}
    />
  );
}
function PlanChip({ plan }: { plan?: Client['plan'] }) {
  const map = {
    Permanent: { label: 'Ativo', color: 'success.main' },
    Trial:     { label: 'Em teste', color: 'warning.main' },
    Inactive:  { label: 'Inativo', color: 'text.disabled' },
  } as const;
  const cfg = map[plan || 'Permanent'];
  return (
    <Chip
      size="small"
      label={cfg.label}
      sx={{
        borderRadius: 999,
        fontWeight: 600,
        color: cfg.color,
        bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
}
function Filters({ onChange }: { onChange: (value: 'todos' | 'ativos' | 'trial' | 'inativos') => void }) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<TuneRoundedIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
      >
        Filtros
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { onChange('todos'); setAnchor(null); }}>Todos</MenuItem>
        <MenuItem onClick={() => { onChange('ativos'); setAnchor(null); }}>Ativos</MenuItem>
        <MenuItem onClick={() => { onChange('trial'); setAnchor(null); }}>Em teste</MenuItem>
        <MenuItem onClick={() => { onChange('inativos'); setAnchor(null); }}>Inativos</MenuItem>
      </Menu>
    </>
  );
}
function ClientPill({
  c, onView, onEdit, onDuplicate, onDelete,
}: {
  c: Client;
  onView: (c: Client) => void;
  onEdit: (c: Client) => void;
  onDuplicate: (c: Client) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 999,
        border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.18)}`,
        bgcolor: 'background.paper',
        transition: 'transform .12s ease, background-color .15s ease, border-color .15s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          borderColor: (t) => alpha(t.palette.primary.main, 0.35),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {}
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 280, flex: 1 }}>
          <Avatar src={c.avatar} alt={c.name} sx={{ width: 32, height: 32 }}>
            {c.name.slice(0, 1)}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap title={c.name}>
              {c.name}
            </Typography>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ color: 'text.secondary' }}>
              {c.email && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EmailRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <Typography variant="caption" noWrap>{c.email}</Typography>
                </Stack>
              )}
              {c.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhoneIphoneRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <Typography variant="caption" noWrap>{normalizePhoneView(c.phone)}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
        {}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 220, flex: 1 }}>
          <DirectionsCarFilledRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
          <Typography variant="body2" color="text.secondary" noWrap title={`${c.model ?? '—'} ${c.year ?? ''}`}>
            {c.model ?? '—'} {c.year ? `• ${c.year}` : ''}
          </Typography>
        </Stack>
        <PlanChip plan={c.plan} />
        <Divider orientation="vertical" flexItem sx={{ mx: 1.25, my: 0.5 }} />
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Visualizar"><IconButton size="small" onClick={() => onView(c)}><VisibilityRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(c)}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Duplicar"><IconButton size="small" onClick={() => onDuplicate(c)}><ContentCopyRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => onDelete(c.id)}><DeleteRoundedIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
export default function ClientsPage() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'todos' | 'ativos' | 'trial' | 'inativos'>('todos');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<'create' | 'edit'>('create');
  const [current, setCurrent] = React.useState<Client | null>(null);
  const openCreate = () => { setMode('create'); setCurrent(null); setOpenDialog(true); };
  const openEdit   = (c: Client) => { setMode('edit'); setCurrent(c); setOpenDialog(true); };
  const { clients: rows, setClients: setRows } = useClients();
  const navigate = useNavigate();
  const onSubmit = (data: ClientForm) => {
    if (mode === 'create') {
      const toAdd: Client = {
        id: genId(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate ? data.birthDate.format('YYYY-MM-DD') : undefined,
        notes: data.notes,
        model: data.model,
        year: data.year === '' ? undefined : data.year,
        plan: data.plan ?? 'Permanent',
        createdAt: new Date().toISOString(),
      };
      setRows((p) => [toAdd, ...p]);
    } else if (current) {
      setRows((p) =>
        p.map((r) =>
          r.id === current.id
            ? {
                ...r,
                name: data.name,
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate ? data.birthDate.format('YYYY-MM-DD') : undefined,
                notes: data.notes,
                model: data.model,
                year: data.year === '' ? undefined : data.year,
                plan: data.plan ?? r.plan,
              }
            : r,
        ),
      );
    }
  };
  const onDelete = (c: Client) => setRows((p) => p.filter((x) => x.id !== c.id));
  const onDuplicate = (c: Client) => {
    const copy: Client = { ...c, id: genId(), name: `${c.name} (cópia)` };
    setRows((p) => [copy, ...p]);
  };
  const filtered = rows
    .filter((r) => {
      if (filter === 'todos') return true;
      if (filter === 'ativos') return r.plan === 'Permanent';
      if (filter === 'trial') return r.plan === 'Trial';
      if (filter === 'inativos') return r.plan === 'Inactive';
      return true;
    })
    .filter((r) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        (r.phone ?? '').includes(q.replace(/[^\d]/g, '')) ||
        (r.model ?? '').toLowerCase().includes(q)
      );
    });
  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4, lg: 6 }, py: { xs: 2, md: 4 } }}>
      {}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={700}>Clientes</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar clientes"
            size="small"
            sx={{
              minWidth: { xs: '100%', md: 360 },
              '& .MuiOutlinedInput-root': { borderRadius: 999, bgcolor: 'background.paper' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <SoftButton startIcon={<AddRoundedIcon />} onClick={openCreate}>
            Novo Cliente
          </SoftButton>
          <Filters onChange={setFilter} />
        </Stack>
      </Stack>
      {}
      <Stack spacing={1.25}>
        {filtered.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, p: 4, textAlign: 'center', bgcolor: (t) => alpha(t.palette.primary.main, 0.02) }}
          >
            <Typography fontWeight={600}>Nenhum cliente encontrado</Typography>
            <Typography variant="body2" color="text.secondary">Ajuste a busca/filtro ou crie um novo cliente.</Typography>
          </Paper>
        ) : (
          filtered.map((c) => (
            <ClientPill
              key={c.id}
              c={c}
              onView={(x) => navigate(`/clientes/${x.id}`)}
              onEdit={openEdit}
              onDuplicate={onDuplicate}
              onDelete={(id) => setRows((p) => p.filter((r) => r.id !== id))}
            />
          ))
        )}
      </Stack>
      <ClientDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        onDelete={mode === 'edit' ? onDelete : undefined}
      />
    </Box>
  );
}