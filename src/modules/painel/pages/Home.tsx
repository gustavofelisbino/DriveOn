import * as React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import DialogCarro from "../../veiculos/dialog/";
import DialogAgendamento from "../../tarefas/dialog/";
import DialogCliente from "../../clientes/dialog/";

function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="contained"
      {...rest}
      sx={{
        borderRadius: 2.5,
        px: 2.5,
        py: 1,
        bgcolor: "primary.main",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        fontSize: 13,
        boxShadow: "none",
        "&:hover": {
          bgcolor: "primary.dark",
          boxShadow: "none",
        },
        ...sx,
      }}
    />
  );
}

function SectionCard({
  title,
  icon,
  count,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        flex: 1,
        minWidth: 0,
      })}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Stack spacing={0.3}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {title}
              </Typography>
              {count !== undefined && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {count} {count === 1 ? "item" : "itens"}
                </Typography>
              )}
            </Stack>
          </Stack>
          {action}
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

function ListRow({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.25,
        px: 1.25,
        borderRadius: 2,
        "&:hover": {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 0.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12, lineHeight: 1.6 }}
            noWrap
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default function Home() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [cars, setCars] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);
  const [openTask, setOpenTask] = React.useState(false);
  const [openCar, setOpenCar] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);
  const nav = useNavigate();

  const totalEntradas = 8650;
  const totalSaidas = 4870;
  const saldo = totalEntradas - totalSaidas;

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [resTasks, resCars, resClients] = await Promise.all([
          api.get("/ordens"),
          api.get("/veiculos"),
          api.get("/clientes"),
        ]);
        setTasks(resTasks.data);
        setCars(resCars.data);
        setClients(resClients.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 1600,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        py: { xs: 3, sm: 3, md: 4 },
      }}
    >
      {/* Cabeçalho */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        mb={{ xs: 3, md: 4 }}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 24, md: 28 } }}>
            Início
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral da sua oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton sx={{ bgcolor: "action.hover" }}>
            <TrendingUpIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: "action.hover" }}>
            <MoreHorizRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Resumo financeiro */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        {[{
          title: "Entradas",
          value: totalEntradas,
          icon: <ArrowDownwardRoundedIcon />,
          color: "success.main"
        }, {
          title: "Saídas",
          value: totalSaidas,
          icon: <ArrowUpwardRoundedIcon />,
          color: "error.main"
        }, {
          title: "Saldo",
          value: saldo,
          icon: <AccountBalanceWalletOutlinedIcon />,
          color: "primary.main"
        }].map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={(t) => ({
              flex: 1,
              borderRadius: 2,
              p: 4,
              border: `1px solid ${t.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "background.paper",
            })}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: (t) => alpha(t.palette[item.color.split(".")[0]].main, 0.1),
                  color: item.color,
                }}
              >
                {item.icon}
              </Box>
              <Stack>
                <Typography fontWeight={700}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  R$ {item.value.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Cards principais */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 2.5, md: 3 }}>
        {/* Atividades */}
        <SectionCard
          title="Atividades"
          icon={<AssignmentRoundedIcon />}
          count={tasks.length}
          action={<SoftButton onClick={() => setOpenTask(true)} startIcon={<AddRoundedIcon />}>Adicionar</SoftButton>}
        >
          <Stack spacing={0.5}>
            {tasks.slice(0, 4).map((t, i) => (
              <ListRow key={i} title={t.descricao ?? "Sem descrição"} subtitle={t.data_agendamento ? new Date(t.data_agendamento).toLocaleString("pt-BR") : "Sem data"} />
            ))}
          </Stack>
        </SectionCard>

        {/* Carros */}
        <SectionCard
          title="Carros cadastrados"
          icon={<DirectionsCarRoundedIcon />}
          count={cars.length}
          action={<SoftButton onClick={() => setOpenCar(true)} startIcon={<AddRoundedIcon />}>Adicionar</SoftButton>}
        >
          <Stack spacing={0.5}>
            {cars.slice(0, 4).map((v, i) => (
              <ListRow key={i} title={`${v.marca} ${v.modelo} - ${v.ano}`} subtitle={v.placa} />
            ))}
          </Stack>
        </SectionCard>

        {/* Clientes */}
        <SectionCard
          title="Clientes"
          icon={<PersonOutlineIcon />}
          count={clients.length}
          action={<SoftButton onClick={() => setOpenClient(true)} startIcon={<AddRoundedIcon />}>Adicionar</SoftButton>}
        >
          <Stack spacing={0.5}>
            {clients.slice(0, 4).map((c, i) => (
              <ListRow key={i} title={c.nome} subtitle={c.telefone ?? ""} />
            ))}
          </Stack>
        </SectionCard>
      </Stack>

      {/* Dialogs */}
      <DialogAgendamento
        open={openTask}
        onClose={() => setOpenTask(false)}
        onCreate={async (data) => {
          try {
            const res = await api.post("/ordens", data);
            setTasks((prev) => [res.data, ...prev]);
            setOpenTask(false);
          } catch (err) {
            console.error("Erro ao criar tarefa:", err);
          }
        }}
      />

      <DialogCarro
        open={openCar}
        onClose={() => setOpenCar(false)}
        onCreate={async (data) => {
          try {
            const res = await api.post("/veiculos", data);
            setCars((prev) => [res.data, ...prev]);
            setOpenCar(false);
          } catch (err) {
            console.error("Erro ao criar carro:", err);
          }
        }}
      />

      <DialogCliente
        open={openClient}
        onClose={() => setOpenClient(false)}
        onCreate={async (data) => {
          try {
            const res = await api.post("/clientes", data);
            setClients((prev) => [res.data, ...prev]);
            setOpenClient(false);
          } catch (err) {
            console.error("Erro ao criar cliente:", err);
          }
        }}
      />
    </Box>
  );
}
