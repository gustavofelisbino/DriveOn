import * as React from 'react';
import {
  Box, Stack, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Button
} from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

export default function RelatorioGeral() {
  const dados = [
    { categoria: 'Clientes cadastrados', valor: 128 },
    { categoria: 'Serviços realizados', valor: 312 },
    { categoria: 'Entradas (R$)', valor: 45890.75 },
    { categoria: 'Saídas (R$)', valor: 24320.30 },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>Relatório Geral</Typography>
          <Typography variant="body2" color="text.secondary">
            Consolidado de dados e indicadores principais
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
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((d, i) => (
              <TableRow key={i}>
                <TableCell>{d.categoria}</TableCell>
                <TableCell align="right">
                  {typeof d.valor === 'number'
                    ? d.categoria.includes('R$')
                      ? `R$ ${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : d.valor
                    : d.valor}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
