import * as React from 'react';
import {
  Box, Stack, Paper, Typography, TextField, InputAdornment,
  Button, Avatar, IconButton, Tooltip, Divider, Menu, MenuItem
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import UserDialog, { type User, type UserForm } from './../dialog';

const genId = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const normalizePhoneView = (s?: string) => {
  const d = (s || '').replace(/\D/g, '');
  if (!d) return '—';
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{0,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{0,4})$/, '$1-$2');
};

const seed: User[] = [
  {
    id: genId(),
    firstName: 'Gustavo',
    lastName: 'Silva',
    email: 'gustavo@ex.com',
    phone: '11987654321',
    createdAt: new Date().toISOString(),
    avatarUrl: '/images/avatars/01.png',
    access: { profile: 'Mecânico', active: true, username: 'gustavo@ex.com', requirePasswordReset: false },
    job: { role: 'Mecânico', department: 'Oficina', employmentType: 'CLT' },
  },
];

export default function UsersPage() {
  const [rows, setRows] = React.useState<User[]>(seed);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'create' | 'edit'>('create');
  const [current, setCurrent] = React.useState<User | null>(null);

  const filtered = rows.filter((u) => {
    const t = query.trim().toLowerCase();
    if (!t) return true;
    return (
      u.firstName.toLowerCase().includes(t) ||
      (u.lastName ?? '').toLowerCase().includes(t) ||
      (u.email ?? '').toLowerCase().includes(t)
    );
  });

  const openCreate = () => { setMode('create'); setCurrent(null); setOpen(true); };
  const openEdit = (u: User) => { setMode('edit'); setCurrent(u); setOpen(true); };

  const onSubmit = (data: UserForm) => {
    if (mode === 'create') {
      const newUser: User = {
        id: genId(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone?.replace(/\D/g, ''),
        createdAt: new Date().toISOString(),
        avatarUrl: '/images/avatars/02.png',
        access: {
          username: data.username,
          profile: data.profile ?? 'Mecânico',
          active: data.active ?? true,
          requirePasswordReset: data.requirePasswordReset ?? false,
        },
        job: {
          role: data.role,
          department: data.department,
          employmentType: data.employmentType,
        },
      };
      setRows((p) => [newUser, ...p]);
    } else if (current) {
      setRows((p) =>
        p.map((u) =>
          u.id === current.id
            ? {
                ...u,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone?.replace(/\D/g, ''),
                job: {
                  ...u.job,
                  role: data.role,
                  department: data.department,
                  employmentType: data.employmentType,
                },
                access: {
                  ...u.access,
                  profile: data.profile ?? u.access?.profile ?? 'Mecânico',
                  active: data.active ?? u.access?.active ?? true,
                  requirePasswordReset: data.requirePasswordReset ?? false,
                },
              }
            : u,
        ),
      );
    }
  };

  const onDelete = (u: User) => setRows((p) => p.filter((x) => x.id !== u.id));

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>Usuários</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os usuários e permissões do sistema
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar usuários"
            size="small"
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' },
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
            onClick={openCreate}
            sx={{ borderRadius: 2 }}
          >
            Novo usuário
          </Button>
        </Stack>
      </Stack>

      {/* Lista */}
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
          <Typography fontWeight={600}>Nenhum usuário encontrado</Typography>
          <Typography variant="body2" color="text.secondary">
            Ajuste a pesquisa ou crie um novo usuário.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.25}>
          {filtered.map((u) => (
            <UserCard key={u.id} user={u} onEdit={openEdit} onDelete={onDelete} />
          ))}
        </Stack>
      )}

      {/* Dialog */}
      <UserDialog
        open={open}
        mode={mode}
        initial={current}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        onDelete={mode === 'edit' ? onDelete : undefined}
      />
    </Box>
  );
}

function UserCard({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

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
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1, minWidth: 260 }}>
          <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36 }}>
            {user.firstName.slice(0, 1)}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }} noWrap>
          {user.job?.role ?? '—'} {user.job?.department ? `• ${user.job.department}` : ''}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }} noWrap>
          {normalizePhoneView(user.phone)}
        </Typography>

        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          PaperProps={{ sx: { borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` } }}
        >
          <MenuItem onClick={() => { setAnchor(null); onEdit(user); }}>
            <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onDelete(user); }} sx={{ color: 'error.main' }}>
            <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
