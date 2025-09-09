import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';

const tasks = [
  { title: 'Troca de vela - Civic 2009', date: '19/07/2025 às 13:10' },
  { title: 'Amortecedor traseiro - Civic 2009', date: '03/07/2025 às 10:45' },
  { title: 'Revisão geral - Peugeot 208 2014', date: '02/07/2025 às 17:00' },
];

export default function Home() {
  return (
    <Box display="flex" justifyContent="center" gap={2}>
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} gap={5}>
      <Box maxWidth={600} minWidth={500} sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Atividades pendentes</Typography>
        <Stack spacing={2}>
          {tasks.map(t => (
            <Card key={t.title} variant="outlined" sx={{ borderRadius: 100, bgcolor: '#fff' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography sx={{ fontWeight: 600 }}>{t.title}</Typography>
                <Typography variant="body2" color="text.secondary">{t.date}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Button sx={{ mt: 2 }} fullWidth variant="contained">Adicionar nova tarefa</Button>
      </Box>

      <Box maxWidth={600} minWidth={400} display="flex" flexDirection="column" sx={{ flex: 1, gap: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Carros adicionados</Typography>
        <Stack spacing={2}>
          {['Chevrolet Astra - 2003','Mitsubishi ASX - 2015','Peugeot 208 - 2014'].map((c)=>(
            <Card key={c} variant="outlined" sx={{ borderRadius: 100, bgcolor: '#fff' }}>
              <CardContent>
                <Typography>{c}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Button sx={{ mt: 2 }} fullWidth variant="contained">Adicionar carro</Button>
      </Box>
    </Stack>
    </Box>
  );
}
