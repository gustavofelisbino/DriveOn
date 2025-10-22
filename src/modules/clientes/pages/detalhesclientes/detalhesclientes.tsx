import * as React from 'react';
import {
  Box, Stack, Typography, Paper, Button, Divider, IconButton, Chip, Tabs, Tab, Fade,
  Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Avatar
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '../../../../context/ClientContext';
import DialogCarro from '../../../painel/dialog/carro';
import ClientDialog from '../../dialog/index';

export default function ClientDetails() {
  const [tab, setTab] = React.useState(0);
  const nav = useNavigate();
  const { id } = useParams();
  const { clients, setClients } = useClients();

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCar, setOpenCar] = React.useState(false);
  const [openFinance, setOpenFinance] = React.useState(false);

  const client = clients.find((client) => client.id === id);

  if (!client) {
    return <Typography>Cliente não encontrado.</Typography>;
  }

  const handleUpdateClient = (updates: Partial<typeof client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const formatPhone = (s: string) =>
    s.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => nav(-1)}
            sx={{
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.15) },
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Stack>
            <Typography variant="h5" fontWeight={700}>
              {client.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalhes do cliente
            </Typography>
          </Stack>
        </Stack>
        <Chip
          label={client.plan}
          color="success"
          sx={{
            fontWeight: 600,
            bgcolor: (t) => alpha(t.palette.success.main, 0.12),
            color: 'success.main',
          }}
        />
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          mb: 3,
        }}
      >
        <Tab label="Resumo" />
        <Tab label="Carros" />
        <Tab label="Financeiro" />
      </Tabs>

      <Fade in={tab === 0} unmountOnExit>
        <Box hidden={tab !== 0}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: { xs: 3, md: 5 },
              bgcolor: 'background.paper',
              borderColor: (t) => alpha(t.palette.divider, 0.6),
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  src={client.avatar}
                  alt={client.name}
                  sx={{
                    width: 100,
                    height: 100,
                    border: (t) => `3px solid ${alpha(t.palette.primary.main, 0.3)}`,
                  }}
                />
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={700}>
                    {client.name}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                    <Typography>{client.email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIphoneRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                    <Typography>{formatPhone(client.phone)}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                startIcon={<EditRoundedIcon />}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.25,
                  fontWeight: 600,
                }}
                onClick={() => setOpenEdit(true)}
              >
                Editar cadastro
              </Button>
            </Stack>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <NotesRoundedIcon sx={{ opacity: 0.7, mt: 0.4 }} />
              <Typography variant="body2" color="text.secondary">
                {client.notes || 'Sem observações.'}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Fade>

      <Fade in={tab === 1} unmountOnExit>
        <Box hidden={tab !== 1}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>
                Carros
              </Typography>
              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={() => setOpenCar(true)}
              >
                Adicionar veículo
              </Button>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Modelo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ano</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Placa</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {client.cars?.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.plate}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() =>
                            handleUpdateClient({
                              cars: client.cars.filter((c) => c.id !== car.id),
                            })
                          }
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Fade>

      <Fade in={tab === 2} unmountOnExit>
        <Box hidden={tab !== 2}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>
                Financeiro
              </Typography>
              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={() => setOpenFinance(true)}
              >
                Novo lançamento
              </Button>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Valor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {client.finance?.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.desc}</TableCell>
                    <TableCell>
                      {new Date(f.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={f.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        color={f.tipo === 'entrada' ? 'success' : 'error'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: (t) =>
                            alpha(
                              f.tipo === 'entrada'
                                ? t.palette.success.main
                                : t.palette.error.main,
                              0.12
                            ),
                          color:
                            f.tipo === 'entrada'
                              ? 'success.main'
                              : 'error.main',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {f.tipo === 'entrada' ? '+' : '-'} R${' '}
                      {f.valor.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Fade>

      <ClientDialog
        open={openEdit}
        mode="edit"
        initial={client}
        onClose={() => setOpenEdit(false)}
        onSubmit={(data) => {
          handleUpdateClient(data);
          setOpenEdit(false);
        }}
      />

      <DialogCarro
        open={openCar}
        onClose={() => setOpenCar(false)}
        onCreate={(data) =>
          handleUpdateClient({
            cars: [...(client.cars || []), data],
          })
        }
      />
    </Box>
  );
}
