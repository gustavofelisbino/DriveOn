import * as React from 'react';
import {
  Box, Stack, Typography, TextField, InputAdornment, Button, IconButton,
  Paper, Chip, Avatar, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import { Controller, useForm } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

type Client = {
  id: string;
  name: string;
  phone?: string;
  model?: string;
  year?: number;
  plan?: 'Permanent' | 'Trial' | 'Inactive';
  email?: string;
  birthDate?: string; // ISO
  notes?: string;
  avatar?: string;
  createdAt: string; // ISO
};

type ClientForm = {
  name: string;
  email?: string;
  phone?: string;
  birthDate?: Dayjs | null;
  notes?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genId = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const normalizePhone = (s?: string) =>
  (s || '')
    .replace(/[^\d]/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2');

// ------- Mock inicial (estilizado como no print) -------
const initial: Client[] = [
  { id: genId(), name: 'Gustavo', phone: '345321231', model: 'Peugeot', year: 2015, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/01.png' },
  { id: genId(), name: 'Lucas',   phone: '987890345', model: 'ASX',     year: 2015, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/02.png' },
  { id: genId(), name: 'Pedro',   phone: '453536122', model: 'Corsa',   year: 2001, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/03.png' },
  { id: genId(), name: 'Vitor',   phone: '345321231', model: 'Uno',     year: 2012, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/04.png' },
  { id: genId(), name: 'Hugo',    phone: '455677881', model: 'Palio',   year: 2013, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/05.png' },
  { id: genId(), name: 'Jorge',   phone: '009918765', model: 'HB20',    year: 2017, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/06.png' },
  { id: genId(), name: 'Pedro',   phone: '238807012', model: 'Onix',    year: 2020, plan: 'Permanent', createdAt: new Date().toISOString(), avatar: '/images/avatars/07.png' },
];

// ===================================================================
// Dialog “bonitinha” (mesmo visual do que fizemos antes, size=small)
// ===================================================================
function ClientDialog({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Client | null;
  onClose: () => void;
  onSave: (data: ClientForm) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ClientForm>({
    mode: 'onChange',
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      birthDate: initial?.birthDate ? dayjs(initial.birthDate) : null,
      notes: initial?.notes ?? '',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        phone: initial?.phone ?? '',
        birthDate: initial?.birthDate ? dayjs(initial.birthDate) : null,
        notes: initial?.notes ?? '',
      });
    }
  }, [open, initial, reset]);

  const submit = (data: ClientForm) => {
    onSave(data);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <PersonRoundedIcon />
              <Stack>
                <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                  {initial ? 'Editar cliente' : 'Novo cliente'}
                </Typography>
                <Typography variant="body2" color="text.secondary">Preencha os dados abaixo</Typography>
              </Stack>
            </Stack>
            <IconButton onClick={onClose}><CloseRoundedIcon /></IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ px: 3 }}>
          <Typography variant="overline" color="text.secondary">Dados básicos</Typography>
          <Grid container spacing={2} mt={0.25} mb={1.5}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Informe o nome', maxLength: { value: 120, message: 'Máx. 120 caracteres' } }}
                render={({ field }) => (
                  <TextField {...field} label="Nome" size="small" fullWidth
                    error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="overline" color="text.secondary">Contato</Typography>
          <Grid container spacing={2} mt={0.25} mb={1.5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{ validate: (v) => !v || emailPattern.test(v) || 'E-mail inválido' }}
                render={({ field }) => (
                  <TextField {...field} label="E-mail (opcional)" size="small" fullWidth
                    error={!!errors.email} helperText={errors.email?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon fontSize="small" /></InputAdornment> }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} value={field.value ?? ''} onChange={(e) => field.onChange(normalizePhone(e.target.value))}
                    label="Telefone (opcional)" placeholder="(11) 99999-9999" size="small" fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneRoundedIcon fontSize="small" /></InputAdornment> }} />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="overline" color="text.secondary">Outros</Typography>
          <Grid container spacing={2} mt={0.25}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="birthDate"
                control={control}
                rules={{ validate: (v) => !v || dayjs(v).isValid() || 'Data inválida' }}
                render={({ field }) => (
                  <DatePicker {...field} label="Data de nascimento (opcional)" format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: 'small', fullWidth: true,
                        error: !!errors.birthDate,
                        helperText: (errors.birthDate?.message as string | undefined) || '',
                        InputProps: { startAdornment: <InputAdornment position="start"><CalendarMonthRoundedIcon fontSize="small" /></InputAdornment> }
                      }
                    }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                rules={{ maxLength: { value: 800, message: 'Máx. 800 caracteres' } }}
                render={({ field }) => (
                  <TextField {...field} label="Observações (opcional)" multiline minRows={3}
                    size="small" fullWidth error={!!errors.notes} helperText={errors.notes?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><NotesRoundedIcon fontSize="small" /></InputAdornment> }} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} startIcon={<CloseRoundedIcon />} variant="outlined" sx={{ borderRadius: 999 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(submit)} variant="contained" disabled={!isValid || isSubmitting} sx={{ borderRadius: 999 }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

// ===================================================================
// Página no estilo do mock
// ===================================================================
export default function ClientsPage() {
  const [rows, setRows] = React.useState<Client[]>(initial);
  const [query, setQuery] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.phone ?? '').toLowerCase().includes(q) ||
      (r.model ?? '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setDialogOpen(true); };

  const handleSave = (data: ClientForm) => {
    if (editing) {
      setRows(prev => prev.map(r => r.id === editing.id
        ? { ...r,
            name: data.name,
            email: data.email?.trim() || undefined,
            phone: data.phone?.trim() || undefined,
            notes: data.notes?.trim() || undefined,
            birthDate: data.birthDate ? data.birthDate.format('YYYY-MM-DD') : undefined }
        : r));
    } else {
      setRows(prev => [{
        id: genId(),
        name: data.name,
        phone: data.phone?.trim(),
        model: '—',
        year: undefined,
        plan: 'Permanent',
        email: data.email?.trim(),
        birthDate: data.birthDate ? data.birthDate.format('YYYY-MM-DD') : undefined,
        notes: data.notes?.trim(),
        createdAt: new Date().toISOString(),
      }, ...prev]);
    }
    setDialogOpen(false);
  };

  const duplicate = (c: Client) => {
    const copy: Client = { ...c, id: genId(), name: `${c.name} (cópia)` };
    setRows(prev => [copy, ...prev]);
  };
  const remove = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Barra superior */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Typography variant="h6" fontWeight={700}>Clientes</Typography>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar clientes"
          size="small"
          sx={{ width: 280 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={openCreate} variant="contained" startIcon={<AddRoundedIcon />} sx={{ borderRadius: 999, height: 36 }}>
          Novo Cliente
        </Button>
        <Button variant="outlined" startIcon={<TuneRoundedIcon />} sx={{ bgcolor: '#fff', height: 36 }}>
          Filtros
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <Table size="small" sx={{
          '& th': { fontWeight: 700, color: 'text.secondary', bgcolor: 'background.default' },
          '& td, & th': { borderBottomColor: (t) => t.palette.divider },
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 320 }}>Cliente</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell align="right" sx={{ pr: 2 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}
                hover
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  '& td': { py: 1.25 }
                }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                      src={c.avatar}
                      alt={c.name}
                      sx={{ width: 28, height: 28, fontSize: 14 }}
                    >
                      {c.name.slice(0,1)}
                    </Avatar>
                    <Typography>{c.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{c.phone || '—'}</TableCell>
                <TableCell>{c.model || '—'}</TableCell>
                <TableCell>{c.year ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={c.plan || '—'}
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      bgcolor: (t) => t.palette.mode === 'light'
                        ? 'rgba(99,102,241,0.12)'
                        : 'rgba(99,102,241,0.22)',
                      borderRadius: 1,
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton size="small"><VisibilityRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => openEdit(c)}><EditRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => duplicate(c)}><ContentCopyRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => remove(c.id)}><DeleteRoundedIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">Nenhum cliente encontrado.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog criar/editar */}
      <ClientDialog open={dialogOpen} initial={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </Box>
  );
}
