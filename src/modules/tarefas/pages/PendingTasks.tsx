import * as React from "react";
import {
  Box, Stack, Typography, Button, TextField, InputAdornment, Paper,
  Chip, IconButton, Menu, MenuItem, Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { useNavigate } from "react-router-dom";
import {
  listarOrdens,
  excluirOrdem,
  criarOrdem,
  atualizarOrdem
} from "../api/api";
import OrdemDialog from "../dialog";

export default function OrdensPage() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<any | null>(null);

  React.useEffect(() => {
    listarOrdens().then(setRows).catch(console.error);
  }, []);

  const handleCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpenDialog(true);
  };

  const handleEdit = (os: any) => {
    setMode("edit");
    setCurrent(os);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await excluirOrdem(id);
    setRows((p) => p.filter((x) => x.id !== id));
  };

  const handleSubmit = async (data: any) => {
    if (mode === "create") {
      const nova = await criarOrdem(data);
      setRows((p) => [nova, ...p]);
    } else if (current) {
      const atualizada = await atualizarOrdem(current.id, data);
      setRows((p) => p.map((x) => (x.id === current.id ? atualizada : x)));
    }
  };

  const filtered = rows.filter((r) =>
    query
      ? r.cliente?.nome?.toLowerCase().includes(query.toLowerCase()) ||
        r.veiculo?.placa?.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700}>Ordens de Serviço</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie as ordens cadastradas na oficina
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por cliente ou placa"
            size="small"
            sx={{
              minWidth: 280,
              "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "background.paper" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleCreate}>
            Nova Ordem
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={1.5}>
        {filtered.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
            }}
          >
            <Typography fontWeight={600}>Nenhuma OS encontrada</Typography>
          </Paper>
        ) : (
          filtered.map((os) => (
            <OrdemCard
              key={os.id}
              os={os}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => navigate(`/ordens/${os.id}`)}
            />
          ))
        )}
      </Stack>

      <OrdemDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

function OrdemCard({ os, onEdit, onDelete, onView }: any) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <AssignmentRoundedIcon color="primary" />
        <Box>
          <Typography fontWeight={700}>
            {os.veiculo?.placa ?? "Sem veículo"} — {os.cliente?.nome ?? "Sem cliente"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Funcionário: {os.funcionario?.nome ?? "—"} • Total: R$ {os.valor_total}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip
          label={os.status}
          size="small"
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
          color={
            os.status === "concluida"
              ? "success"
              : os.status === "em_andamento"
              ? "info"
              : os.status === "cancelada"
              ? "error"
              : "warning"
          }
        />
        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <MenuItem onClick={() => { setAnchor(null); onView(); }}>Visualizar</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onEdit(os); }}>Editar</MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); onDelete(os.id); }} sx={{ color: "error.main" }}>
            Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
