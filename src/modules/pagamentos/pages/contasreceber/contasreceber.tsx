import * as React from 'react';
import { useState } from 'react';
import {
  Box, Stack, Typography, Paper, TextField, InputAdornment, Button, Chip,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Fade, TablePagination
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Controller, useForm } from 'react-hook-form';

type Conta = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'recebido' | 'atrasado';
};

type FormValues = {
  cliente: string;
  descricao: string;
  valor: number;
  vencimento: string;
};

const mockData: Conta[] = [
  { id: 1, cliente: 'João Silva', descricao: 'Troca de óleo - Civic 2009', valor: 350, vencimento: '2025-01-25', status: 'pendente' },
  { id: 2, cliente: 'Maria Santos', descricao: 'Revisão completa - Peugeot 208', valor: 1200, vencimento: '2025-01-20', status: 'atrasado' },
  { id: 3, cliente: 'Pedro Costa', descricao: 'Troca de pastilhas de freio', valor: 480, vencimento: '2025-01-15', status: 'recebido' },
  { id: 4, cliente: 'Ana Oliveira', descricao: 'Alinhamento e balanceamento', valor: 180, vencimento: '2025-01-28', status: 'pendente' },
];

function NovaContaDialog({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (data: FormValues) => void }) {
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { cliente: '', descricao: '', valor: 0, vencimento: '' },
  });

  const onSubmit = (data: FormValues) => {
    onCreate(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Nova conta a receber</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <Controller
            name="cliente"
            control={control}
            rules={{ required: 'Informe o cliente' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cliente"
                placeholder="Nome do cliente"
                autoFocus
                error={!!errors.cliente}
                helperText={errors.cliente?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="descricao"
            control={control}
            rules={{ required: 'Informe a descrição' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição"
                placeholder="Serviço prestado"
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="valor"
            control={control}
            rules={{ required: 'Informe o valor', min: { value: 0.01, message: 'Valor deve ser maior que zero' } }}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                label="Valor"
                type="number"
                placeholder="0,00"
                error={!!errors.valor}
                helperText={errors.valor?.message}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            )}
          />
          <Controller
            name="vencimento"
            control={control}
            rules={{ required: 'Informe o vencimento' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Vencimento"
                type="date"
                error={!!errors.vencimento}
                helperText={errors.vencimento?.message}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={!isValid}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ContasReceber() {
  const [contas, setContas] = useState<Conta[]>(mockData);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleMarcarRecebido = () => {
    if (selectedId) {
      setContas(contas.map(c => c.id === selectedId ? { ...c, status: 'recebido' } : c));
    }
    handleMenuClose();
  };

  const handleCreate = (data: FormValues) => {
    const novaConta: Conta = {
      id: contas.length + 1,
      cliente: data.cliente,
      descricao: data.descricao,
      valor: data.valor,
      vencimento: data.vencimento,
      status: 'pendente',
    };
    setContas([novaConta, ...contas]);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pendente: { label: 'Pendente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      recebido: { label: 'Recebido', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      atrasado: { label: 'Atrasado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    return configs[status as keyof typeof configs] || configs.pendente;
  };

  const filtered = contas.filter((c) =>
    c.cliente.toLowerCase().includes(query.toLowerCase()) ||
    c.descricao.toLowerCase().includes(query.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const totalRecebido = contas.filter(c => c.status === 'recebido').reduce((sum, c) => sum + c.valor, 0);
  const totalAtrasado = contas.filter(c => c.status === 'atrasado').reduce((sum, c) => sum + c.valor, 0);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, md: 3 } }}>
      {/* Header */}
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h5" fontWeight={700}>Contas a Receber</Typography>
        <Typography variant="body2" color="text.secondary">Gerencie os valores a receber dos clientes</Typography>
      </Stack>

      {/* Cards de resumo */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'PENDENTE', valor: totalPendente, cor: 'warning.main' },
          { label: 'RECEBIDO', valor: totalRecebido, cor: 'success.main' },
          { label: 'ATRASADO', valor: totalAtrasado, cor: 'error.main' },
        ].map((c) => (
          <Paper key={c.label} sx={{ flex: 1, p: 2, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{c.label}</Typography>
            <Typography variant="h5" fontWeight={700} color={c.cor}>R$ {c.valor.toFixed(2)}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* Pesquisa e ações */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mb={2.5}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar contas"
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
            Nova Conta
          </Button>
          <IconButton sx={{ border: (t) => `1px solid ${t.palette.divider}` }}>
            <FilterListRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Tabela */}
      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CLIENTE</TableCell>
                <TableCell>DESCRIÇÃO</TableCell>
                <TableCell>VALOR</TableCell>
                <TableCell>VENCIMENTO</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((conta) => {
                const statusConfig = getStatusConfig(conta.status);
                return (
                  <TableRow key={conta.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{conta.cliente}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{conta.descricao}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>R$ {conta.valor.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: statusConfig.bg,
                          color: statusConfig.color,
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, conta.id)}>
                        <MoreVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Paginação traduzida */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </TableContainer>
      </Fade>

      {/* Menu de ações */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMarcarRecebido}>
          <CheckCircleOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Marcar como recebido
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Excluir
        </MenuItem>
      </Menu>

      <NovaContaDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreate={handleCreate} />
    </Box>
  );
}
