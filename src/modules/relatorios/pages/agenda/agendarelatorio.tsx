import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import api from '../../../../api/api';
import { useAuth } from '../../../../context/AuthContext';

type Agendamento = {
  id: number;
  cliente: { nome: string } | string;
  servico?: string;
  data_agendamento: string;
  horario?: string;
};

export default function RelatorioAgenda() {
  const { user } = useAuth();
  const [agenda, setAgenda] = React.useState<Agendamento[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.oficina_id) return;
    (async () => {
      try {
        const { data } = await api.get(`/ordens`, {
          params: { oficina_id: user.oficina_id },
        });

        // transforma os dados caso venham aninhados
        const agendamentos = data.map((a: any) => ({
          id: a.id,
          cliente: a.cliente?.nome ?? a.cliente ?? '—',
          servico: a.servico ?? a.descricao ?? '—',
          data_agendamento: a.data_agendamento ?? a.data ?? new Date().toISOString(),
          horario: a.horario ?? new Date(a.data_agendamento ?? a.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }));

        setAgenda(agendamentos);
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.oficina_id]);

  const handleExportarCSV = () => {
    if (!agenda.length) return alert('Nenhum agendamento encontrado para exportar.');

    const header = ['Cliente', 'Serviço', 'Data', 'Horário'];
    const rows = agenda.map((a) => [
      typeof a.cliente === 'string' ? a.cliente : a.cliente.nome,
      a.servico ?? '—',
      new Date(a.data_agendamento).toLocaleDateString('pt-BR'),
      a.horario ?? '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((r) => r.join(';')).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `relatorio_agenda_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 3 }}>
      {/* Cabeçalho */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            Relatório de Agenda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agendamentos e horários registrados
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<FileDownloadRoundedIcon />}
          sx={{ borderRadius: 2 }}
          onClick={handleExportarCSV}
        >
          Exportar CSV
        </Button>
      </Stack>

      {/* Tabela */}
      <Paper variant="outlined" sx={{ borderRadius: 1 }}>
        {agenda.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Serviço</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agenda.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {typeof a.cliente === 'string' ? a.cliente : a.cliente.nome}
                  </TableCell>
                  <TableCell>{a.servico}</TableCell>
                  <TableCell>
                    {new Date(a.data_agendamento).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{a.horario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">
              Nenhum agendamento encontrado.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
