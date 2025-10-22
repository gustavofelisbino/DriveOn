import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Paper,
  Chip,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useNavigate } from "react-router-dom";
import ClientDialog, { type Client, type ClientForm } from "../dialog";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/api";

// ==============================
// API functions
// ==============================
async function listarClientes(): Promise<Client[]> {
  const { data } = await api.get("/clientes");
  return data.map((c: any) => ({
    id: String(c.id),
    name: c.nome,
    email: c.email,
    phone: c.telefone,
    notes: c.observacao,
    birthDate: c.data_nascimento
      ? new Date(c.data_nascimento).toISOString()
      : undefined,
    plan:
      c.status === "ativo"
        ? "Permanent"
        : c.status === "teste"
        ? "Trial"
        : "Inactive",
    createdAt: c.criado_em,
  }));
}

async function criarCliente(data: ClientForm, oficinaId: number): Promise<Client> {
  const payload = {
    nome: data.name,
    email: data.email,
    telefone: data.phone,
    observacao: data.notes,
    data_nascimento: data.birthDate
      ? new Date(data.birthDate).toISOString()
      : null,
    status:
      data.plan === "Permanent"
        ? "ativo"
        : data.plan === "Trial"
        ? "teste"
        : "inativo",
    oficina_id: oficinaId,
  };

  console.log("🛰️ Enviando POST /clientes:", payload);
  const { data: c } = await api.post("/clientes", payload);
  return {
    id: String(c.id),
    name: c.nome,
    email: c.email,
    phone: c.telefone,
    notes: c.observacao,
    plan:
      c.status === "ativo"
        ? "Permanent"
        : c.status === "teste"
        ? "Trial"
        : "Inactive",
    createdAt: c.criado_em,
  };
}

async function atualizarCliente(id: string, data: ClientForm): Promise<Client> {
  const { data: c } = await api.put(`/clientes/${id}`, {
    nome: data.name,
    email: data.email,
    telefone: data.phone,
    observacao: data.notes,
    data_nascimento: data.birthDate
      ? new Date(data.birthDate).toISOString()
      : null,
    status:
      data.plan === "Permanent"
        ? "ativo"
        : data.plan === "Trial"
        ? "teste"
        : "inativo",
  });
  return {
    id: String(c.id),
    name: c.nome,
    email: c.email,
    phone: c.telefone,
    notes: c.observacao,
    plan:
      c.status === "ativo"
        ? "Permanent"
        : c.status === "teste"
        ? "Trial"
        : "Inactive",
    createdAt: c.criado_em,
  };
}

async function excluirCliente(id: string): Promise<void> {
  await api.delete(`/clientes/${id}`);
}

// ==============================
// Página principal
// ==============================
export default function ClientsPage() {
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<Client | null>(null);
  const [rows, setRows] = React.useState<Client[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuClientId, setMenuClientId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    listarClientes()
      .then(setRows)
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  const openCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpenDialog(true);
  };

  const openEdit = (c: Client) => {
    setMode("edit");
    setCurrent(c);
    setOpenDialog(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setMenuClientId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuClientId(null);
  };

  const handleEdit = () => {
    const cliente = rows.find((r) => r.id === menuClientId);
    if (cliente) openEdit(cliente);
    handleMenuClose();
  };

  const handleDelete = () => {
    const cliente = rows.find((r) => r.id === menuClientId);
    if (cliente && window.confirm(`Tem certeza que deseja excluir ${cliente.name}?`)) {
      onDelete(cliente.id);
    }
    handleMenuClose();
  };

  const onSubmit = async (data: ClientForm) => {
    try {
      if (mode === "create") {
        if (!user?.oficinaId) {
          console.error("❌ Usuário logado sem oficinaId:", user);
          alert("Usuário sem oficina vinculada. Faça login novamente.");
          return;
        }

        console.log("➡️ Criando cliente com oficina_id =", user.oficinaId);
        const novo = await criarCliente(data, user.oficinaId);
        setRows((p) => [novo, ...p]);
        setOpenDialog(false);
        return;
      }

      if (current) {
        const atualizado = await atualizarCliente(current.id, data);
        setRows((p) => p.map((r) => (r.id === current.id ? atualizado : r)));
        setOpenDialog(false);
      }
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert("Erro ao salvar cliente. Veja o console para detalhes.");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await excluirCliente(id);
      setRows((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
    }
  };

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.phone ?? "").includes(q.replace(/[^\d]/g, "")) ||
      (r.notes ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>
            Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os clientes cadastrados na sua oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar clientes"
            size="small"
            sx={{
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openCreate}
            sx={{ borderRadius: 2 }}
          >
            Novo Cliente
          </Button>
        </Stack>
      </Stack>

      {/* Lista de clientes */}
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
            <Typography fontWeight={600}>Nenhum cliente encontrado</Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo cliente.
            </Typography>
          </Paper>
        ) : (
          filtered.map((c) => (
            <Paper
              key={c.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar>{c.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{c.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {c.email || "—"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  label={
                    c.plan === "Permanent"
                      ? "Ativo"
                      : c.plan === "Trial"
                      ? "Em teste"
                      : "Inativo"
                  }
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontWeight: 600,
                    color:
                      c.plan === "Permanent"
                        ? "success.main"
                        : c.plan === "Trial"
                        ? "warning.main"
                        : "text.disabled",
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
                  }}
                />
                <IconButton onClick={(e) => handleMenuOpen(e, c.id)}>
                  <MoreVertRoundedIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>

      {/* Menu global */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Excluir</MenuItem>
      </Menu>

      {/* Diálogo */}
      <ClientDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        onDelete={mode === "edit" ? () => onDelete(current?.id ?? "") : undefined}
      />
    </Box>
  );
}
