import * as React from 'react';
import {
  Box, Stack, Typography, TextField, InputAdornment, Button, Paper, Avatar,
  IconButton, Tooltip, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import UserDialog, { type User, type UserForm } from './../dialog';

const genId = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const normalizePhoneView = (s?: string) => {
  const d = (s || '').replace(/\D/g, '');
  if (!d) return '—';
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{0,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{0,4})$/, '$1-$2');
};

const seed: User[] = [
  { id: genId(), firstName: 'Gustavo', lastName: 'Silva', email: 'gustavo@ex.com', phone: '11987654321', createdAt: new Date().toISOString(), avatarUrl: '/images/avatars/01.png',
    access: { profile: 'Mecânico', active: true, username: 'gustavo@ex.com', requirePasswordReset: false },
    job: { role: 'Mecânico', department: 'Oficina', employmentType: 'CLT' } },
];

function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="text"
      {...rest}
      sx={{
        borderRadius: 999,
        px: 1.75, py: 0.75, fontWeight: 600, textTransform: 'none',
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
        color: 'primary.main',
        '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
        ...sx,
      }}
    />
  );
}

export default function UsersPage() {
  const [rows, setRows] = React.useState<User[]>(seed);
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'create'|'edit'>('create');
  const [current, setCurrent] = React.useState<User | null>(null);

  const filtered = rows.filter((u) => {
    const t = q.trim().toLowerCase();
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
        birthDate: data.birthDate ? data.birthDate.toDate().toISOString() : undefined,
        maritalStatus: data.maritalStatus,
        gender: data.gender,
        nationality: data.nationality,
        address: { street: data.street, city: data.city, state: data.state, zip: data.zip?.replace(/\D/g, '') },
        job: {
          role: data.role,
          department: data.department,
          hireDate: data.hireDate ? data.hireDate.toDate().toISOString() : undefined,
          employmentType: data.employmentType,
          salary: typeof data.salary === 'number' ? data.salary : undefined,
          manager: data.manager,
        },
        documents: {
          cpf: data.cpf?.replace(/\D/g, ''),
          rg: data.rg,
          cnh: data.cnh,
          cnhExpiry: data.cnhExpiry ? data.cnhExpiry.toDate().toISOString() : undefined,
        },
        access: {
          username: data.username,
          profile: data.profile ?? 'Mecânico',
          active: data.active ?? true,
          requirePasswordReset: data.requirePasswordReset ?? false,
        },
        createdAt: new Date().toISOString(),
      };
      setRows((p) => [newUser, ...p]);
    } else if (current) {
      setRows((p) => p.map((u) =>
        u.id === current.id
          ? {
              ...u,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone?.replace(/\D/g, ''),
              birthDate: data.birthDate ? data.birthDate.toDate().toISOString() : u.birthDate,
              maritalStatus: data.maritalStatus,
              gender: data.gender,
              nationality: data.nationality,
              address: { street: data.street, city: data.city, state: data.state, zip: data.zip?.replace(/\D/g, '') },
              job: {
                ...u.job,
                role: data.role,
                department: data.department,
                hireDate: data.hireDate ? data.hireDate.toDate().toISOString() : u.job?.hireDate,
                employmentType: data.employmentType,
                salary: typeof data.salary === 'number' ? data.salary : u.job?.salary,
                manager: data.manager,
              },
              documents: {
                ...u.documents,
                cpf: data.cpf?.replace(/\D/g, ''),
                rg: data.rg,
                cnh: data.cnh,
                cnhExpiry: data.cnhExpiry ? data.cnhExpiry.toDate().toISOString() : u.documents?.cnhExpiry,
              },
              access: {
                username: data.username,
                profile: data.profile ?? u.access?.profile ?? 'Mecânico',
                active: data.active ?? u.access?.active ?? true,
                requirePasswordReset: data.requirePasswordReset ?? false,
              },
            }
          : u,
      ));
    }
  };

  const onDelete = (u: User) => setRows((p) => p.filter((x) => x.id !== u.id));

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4, lg: 6 }, py: { xs: 2, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={700}>Usuários</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar usuários"
            size="small"
            sx={{ minWidth: { xs: '100%', md: 360 }, '& .MuiOutlinedInput-root': { borderRadius: 999, bgcolor: 'background.paper' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
          <SoftButton startIcon={<AddRoundedIcon />} onClick={openCreate}>
            Novo usuário
          </SoftButton>
        </Stack>
      </Stack>

      <Stack spacing={1.25}>
        {filtered.map((u) => (
          <Paper
            key={u.id}
            elevation={0}
            sx={{
              px: 2, py: 1.25, borderRadius: 999,
              border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.18)}`,
              bgcolor: 'background.paper',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'transform .12s ease, background-color .15s ease, border-color .15s ease',
              '&:hover': { transform: 'translateY(-1px)', borderColor: (t) => alpha(t.palette.primary.main, 0.35), bgcolor: (t) => alpha(t.palette.primary.main, 0.03) },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 260, flex: 1 }}>
              <Avatar src={u.avatarUrl} sx={{ width: 32, height: 32 }}>{u.firstName.slice(0,1)}</Avatar>
              <Stack sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{u.firstName} {u.lastName}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{u.email ?? '—'}</Typography>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200 }} noWrap>
              {u.job?.role ?? '—'} {u.job?.department ? `• ${u.job.department}` : ''}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160 }} noWrap>
              {normalizePhoneView(u.phone)}
            </Typography>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Editar"><IconButton size="small" onClick={() => openEdit(u)}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => onDelete(u)}><DeleteRoundedIcon fontSize="small" /></IconButton></Tooltip>
            </Stack>
          </Paper>
        ))}
      </Stack>

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
