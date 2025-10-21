import * as React from 'react';
import {
  Box, Stack, Typography, Paper, TextField, InputAdornment, Button, Chip,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Fade, TablePagination
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

type Orcamento = {
  id: number;
  cliente: string;
  veiculo: string;
  descricao: string;
  valor: number;
  data: string;
  status: 'analise' | 'aprovado' | 'recusado';
};

type FormValues = {
  cliente: string;
  veiculo: string;
  descricao: string;
  valor: number;
  data: string;
};

const mockData: Orcamento[] = [
  { id: 1, cliente: 'Gustavo Freitas', veiculo: 'Peugeot 208', descricao: 'Revisão completa', valor: 1200, data: '2025-01-22', status: 'aprovado' },
  { id: 2, cliente: 'Maria Silva', veiculo: 'Civic 2009', descricao: 'Troca de pastilhas de freio', valor: 480, data: '2025-01-25', status: 'analise' },
  { id: 3, cliente: 'Pedro Costa', veiculo: 'Fiat Uno', descricao: 'Troca de óleo e filtros', valor: 250, data: '2025-01-18', status: 'recusado' },
];

function NovoOrcamentoDialog({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (data: FormValues) => void }) {
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { cliente: '', veiculo: '', descricao: '', valor: 0, data: '' },
  });

  const onSubmit = (data: FormValues) => {
    onCreate(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Novo Orçamento</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <Controller
            name="cliente"
            control={control}
            rules={{ required: 'Informe o cliente' }}
            render={({ field }) => (
              <TextField {...field} label="Cliente" placeholder="Nome do cliente" autoFocus error={!!errors.cliente} helperText={errors.cliente?.message} fullWidth />
            )}
          />
          <Controller
            name="veiculo"
            control={control}
            rules={{ required: 'Informe o veículo' }}
            render={({ field }) => (
              <TextField {...field} label="Veículo" placeholder="Modelo e ano" error={!!errors.veiculo} helperText={errors.veiculo?.message} fullWidth />
            )}
          />
          <Controller
            name="descricao"
            control={control}
            rules={{ required: 'Informe o serviço' }}
            render={({ field }) => (
              <TextField {...field} label="Descrição" placeholder="Serviços solicitados" error={!!errors.descricao} helperText={errors.descricao?.message} fullWidth />
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
            name="data"
            control={control}
            rules={{ required: 'Informe a data do orçamento' }}
            render={({ field }) => (
              <TextField {...field} label="Data" type="date" error={!!errors.data} helperText={errors.data?.message} fullWidth InputLabelProps={{ shrink: true }} />
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

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = React.useState<Orcamento[]>(mockData);
  const [query, setQuery] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleAprovar = () => {
    if (selectedId) {
      setOrcamentos((prev) =>
        prev.map((o) => (o.id === selectedId ? { ...o, status: 'aprovado' } : o))
      );
    }
    handleMenuClose();
  };

  const handleRecusar = () => {
    if (selectedId) {
      setOrcamentos((prev) =>
        prev.map((o) => (o.id === selectedId ? { ...o, status: 'recusado' } : o))
      );
    }
    handleMenuClose();
  };

  const handleCreate = (data: FormValues) => {
    const novoOrcamento: Orcamento = {
      id: orcamentos.length + 1,
      cliente: data.cliente,
      veiculo: data.veiculo,
      descricao: data.descricao,
      valor: data.valor,
      data: data.data,
      status: 'analise',
    };
    setOrcamentos([novoOrcamento, ...orcamentos]);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      analise: { label: 'Em análise', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      aprovado: { label: 'Aprovado', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      recusado: { label: 'Recusado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    return configs[status as keyof typeof configs];
  };

  const filtered = orcamentos.filter(
    (o) =>
      o.cliente.toLowerCase().includes(query.toLowerCase()) ||
      o.veiculo.toLowerCase().includes(query.toLowerCase()) ||
      o.descricao.toLowerCase().includes(query.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalAnalise = orcamentos.filter(o => o.status === 'analise').reduce((s, o) => s + o.valor, 0);
  const totalAprovado = orcamentos.filter(o => o.status === 'aprovado').reduce((s, o) => s + o.valor, 0);
  const totalRecusado = orcamentos.filter(o => o.status === 'recusado').reduce((s, o) => s + o.valor, 0);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, md: 3 } }}>
      {/* Header */}
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h5" fontWeight={700}>Orçamentos</Typography>
        <Typography variant="body2" color="text.secondary">Controle de orçamentos e aprovações</Typography>
      </Stack>

      {/* Cards de resumo */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'EM ANÁLISE', valor: totalAnalise, cor: 'warning.main' },
          { label: 'APROVADOS', valor: totalAprovado, cor: 'success.main' },
          { label: 'RECUSADOS', valor: totalRecusado, cor: 'error.main' },
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
          placeholder="Pesquisar orçamentos"
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
            Novo Orçamento
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
                <TableCell>VEÍCULO</TableCell>
                <TableCell>DESCRIÇÃO</TableCell>
                <TableCell>VALOR</TableCell>
                <TableCell>DATA</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((orc) => {
                const status = getStatusConfig(orc.status);
                return (
                  <TableRow key={orc.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{orc.cliente}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{orc.veiculo}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{orc.descricao}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>R$ {orc.valor.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{new Date(orc.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: status.bg,
                          color: status.color,
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, orc.id)}>
                        <MoreVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Paginação */}
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
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          />
        </TableContainer>
      </Fade>

      {/* Menu de ações */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAprovar}>
          <CheckCircleOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Aprovar orçamento
        </MenuItem>
        <MenuItem onClick={handleRecusar}>
          <CancelRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Recusar orçamento
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      <NovoOrcamentoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreate={handleCreate} />
    </Box>
  );
}
