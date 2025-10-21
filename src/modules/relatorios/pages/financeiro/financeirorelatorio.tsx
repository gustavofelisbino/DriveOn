import * as React from 'react';
import {
  Box, Stack, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

export default function RelatorioFinanceiro() {
  const dados = [
    { tipo: 'Entrada', descricao: 'Troca de óleo', valor: 350, data: '2025-01-12' },
    { tipo: 'Saída', descricao: 'Compra de peças', valor: 720, data: '2025-01-13' },
    { tipo: 'Entrada', descricao: 'Revisão completa', valor: 1200, data: '2025-01-15' },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>Relatório Financeiro</Typography>
          <Typography variant="body2" color="text.secondary">
            Entradas e saídas registradas
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
              <TableCell>Tipo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((f, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Chip
                    label={f.tipo}
                    color={f.tipo === 'Entrada' ? 'success' : 'error'}
                    size="small"
                    sx={{
                      bgcolor: (t) =>
                        alpha(
                          f.tipo === 'Entrada'
                            ? t.palette.success.main
                            : t.palette.error.main,
                          0.12
                        ),
                      color: f.tipo === 'Entrada' ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>{f.descricao}</TableCell>
                <TableCell>R$ {f.valor.toFixed(2)}</TableCell>
                <TableCell>{new Date(f.data).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
