import * as React from 'react';
import {
  Box, Stack, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Button
} from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

export default function RelatorioAgenda() {
  const agenda = [
    { cliente: 'João Silva', servico: 'Revisão completa', data: '2025-02-10', horario: '14:00' },
    { cliente: 'Maria Souza', servico: 'Troca de pneus', data: '2025-02-11', horario: '09:30' },
    { cliente: 'Carlos Mendes', servico: 'Alinhamento', data: '2025-02-12', horario: '11:00' },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>Relatório de Agenda</Typography>
          <Typography variant="body2" color="text.secondary">
            Agendamentos e horários registrados
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<FileDownloadRoundedIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => alert('Exportar CSV')}
        >
          Exportar
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
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
            {agenda.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{a.cliente}</TableCell>
                <TableCell>{a.servico}</TableCell>
                <TableCell>{new Date(a.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{a.horario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
