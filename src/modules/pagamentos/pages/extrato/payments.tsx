import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Divider,
  TablePagination,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

type Transacao = {
  id: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  responsavel: string;
};

const mockTransacoes: Transacao[] = [
  { id: 1, tipo: 'entrada', descricao: 'Troca de óleo - Civic 2009', categoria: 'Serviço', valor: 350, data: '2025-01-22', responsavel: 'João Silva' },
  { id: 2, tipo: 'saida', descricao: 'Pastilhas de freio', categoria: 'Peças', valor: 280, data: '2025-01-22', responsavel: 'Auto Peças Silva' },
  { id: 3, tipo: 'entrada', descricao: 'Revisão completa - Peugeot 208', categoria: 'Serviço', valor: 1200, data: '2025-01-21', responsavel: 'Maria Santos' },
  { id: 4, tipo: 'saida', descricao: 'Óleo lubrificante 20L', categoria: 'Insumos', valor: 450, data: '2025-01-21', responsavel: 'Distribuidora Premium' },
  { id: 5, tipo: 'entrada', descricao: 'Troca de pastilhas de freio', categoria: 'Serviço', valor: 480, data: '2025-01-20', responsavel: 'Pedro Costa' },
  { id: 6, tipo: 'saida', descricao: 'Conta de luz - Janeiro', categoria: 'Contas', valor: 890, data: '2025-01-20', responsavel: 'Energia Elétrica' },
  { id: 7, tipo: 'entrada', descricao: 'Alinhamento e balanceamento', categoria: 'Serviço', valor: 180, data: '2025-01-19', responsavel: 'Ana Oliveira' },
  { id: 8, tipo: 'saida', descricao: 'Jogo de chaves', categoria: 'Ferramentas', valor: 320, data: '2025-01-19', responsavel: 'Ferramentas & Cia' },
  { id: 9, tipo: 'entrada', descricao: 'Troca de amortecedores', categoria: 'Serviço', valor: 850, data: '2025-01-18', responsavel: 'Carlos Mendes' },
  { id: 10, tipo: 'saida', descricao: 'Internet - Janeiro', categoria: 'Contas', valor: 150, data: '2025-01-18', responsavel: 'Telecom' },
];

export default function ExtratoFinanceiro() {
  const [transacoes] = useState<Transacao[]>(mockTransacoes);
  const [query, setQuery] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const transacoesFiltradas = transacoes.filter(t => {
    const matchQuery =
      t.descricao.toLowerCase().includes(query.toLowerCase()) ||
      t.responsavel.toLowerCase().includes(query.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    return matchQuery && matchTipo;
  });

  const paginated = transacoesFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      {/* Header */}
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Extrato Financeiro
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão completa de todas as movimentações financeiras
        </Typography>
      </Stack>

      {/* Cards de Resumo */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'ENTRADAS', valor: totalEntradas, cor: 'success.main' },
          { label: 'SAÍDAS', valor: totalSaidas, cor: 'error.main' },
          { label: 'SALDO', valor: saldo, cor: saldo >= 0 ? 'primary.main' : 'warning.main' },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2.5,
              border: (t) => `1px solid ${t.palette.divider}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: item.cor,
              },
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {item.label}
            </Typography>
            <Typography variant="h5" fontWeight={700} color={item.cor}>
              R$ {item.valor.toFixed(2)}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Filtros */}
      <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap" gap={1}>
        <Chip
          icon={<CalendarTodayRoundedIcon sx={{ fontSize: 16 }} />}
          label="Todos"
          onClick={() => setFiltroTipo('todos')}
          sx={{
            fontWeight: 600,
            bgcolor: filtroTipo === 'todos' ? (t) => alpha(t.palette.primary.main, 0.1) : 'transparent',
            color: filtroTipo === 'todos' ? 'primary.main' : 'text.secondary',
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        />
        <Chip
          icon={<ArrowDownwardRoundedIcon sx={{ fontSize: 16 }} />}
          label="Entradas"
          onClick={() => setFiltroTipo('entrada')}
          sx={{
            fontWeight: 600,
            bgcolor: filtroTipo === 'entrada' ? (t) => alpha(t.palette.success.main, 0.1) : 'transparent',
            color: filtroTipo === 'entrada' ? 'success.main' : 'text.secondary',
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        />
        <Chip
          icon={<ArrowUpwardRoundedIcon sx={{ fontSize: 16 }} />}
          label="Saídas"
          onClick={() => setFiltroTipo('saida')}
          sx={{
            fontWeight: 600,
            bgcolor: filtroTipo === 'saida' ? (t) => alpha(t.palette.error.main, 0.1) : 'transparent',
            color: filtroTipo === 'saida' ? 'error.main' : 'text.secondary',
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        />
      </Stack>


      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mb={2.5}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar transações"
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
        <IconButton sx={{ border: (t) => `1px solid ${t.palette.divider}` }}>
          <FilterListRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Tabela */}
      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DATA</TableCell>
                <TableCell>TIPO</TableCell>
                <TableCell>DESCRIÇÃO</TableCell>
                <TableCell>CATEGORIA</TableCell>
                <TableCell>RESPONSÁVEL</TableCell>
                <TableCell align="right">VALOR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>{formatarData(t.data)}</TableCell>
                  <TableCell>
                    <Chip
                      label={t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      size="small"
                      sx={{
                        bgcolor: t.tipo === 'entrada'
                          ? (th) => alpha(th.palette.success.main, 0.1)
                          : (th) => alpha(th.palette.error.main, 0.1),
                        color: t.tipo === 'entrada' ? 'success.main' : 'error.main',
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  </TableCell>
                  <TableCell>{t.descricao}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{t.categoria}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{t.responsavel}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: t.tipo === 'entrada' ? 'success.main' : 'error.main' }}>
                    {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={transacoesFiltradas.length}
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

          <Box sx={{ p: 2.5, bgcolor: (t) => alpha(t.palette.action.hover, 0.05) }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Total de transações: {transacoesFiltradas.length}
              </Typography>
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" gap={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Entradas:
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    + R$ {totalEntradas.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Saídas:
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main">
                    - R$ {totalSaidas.toFixed(2)}
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Saldo:
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color={saldo >= 0 ? 'primary.main' : 'warning.main'}>
                    R$ {saldo.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </TableContainer>
      </Fade>
    </Box>
  );
}
