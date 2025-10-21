import * as React from 'react';
import {
  Box, Stack, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

export default function RelatorioClientes() {
  const clientes = [
    { nome: 'Gustavo Freitas', email: 'gustavo@exemplo.com', telefone: '(48) 99999-1234', data: '2024-07-12' },
    { nome: 'Maria Santos', email: 'maria@exemplo.com', telefone: '(48) 98888-6543', data: '2024-08-02' },
    { nome: 'João Silva', email: 'joao@exemplo.com', telefone: '(48) 97777-4321', data: '2024-09-18' },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>Relatório de Clientes</Typography>
          <Typography variant="body2" color="text.secondary">
            Lista completa de clientes cadastrados
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
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Cadastro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{c.nome}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telefone}</TableCell>
                <TableCell>{new Date(c.data).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
