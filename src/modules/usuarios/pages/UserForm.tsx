import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useAuth } from "../../../context/AuthContext";

import FuncionarioDialog, {
  type FuncionarioForm,
} from "../dialog";
import {
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
} from "../api/api";

export default function FuncionariosPage() {
  const [rows, setRows] = React.useState<Funcionario[]>([]);
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<Funcionario | null>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    listarFuncionarios()
      .then(setRows)
      .catch((err) => console.error("Erro ao carregar funcionários:", err));
  }, []);

  const openCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpenDialog(true);
  };

  const openEdit = (f: Funcionario) => {
    setMode("edit");
    setCurrent(f);
    setOpenDialog(true);
  };

  const onSubmit = async (data: FuncionarioForm) => {
    try {
      if (mode === "create") {
        const novo = await criarFuncionario(data);
        setRows((p) => [novo, ...p]);
      } else if (current) {
        const atualizado = await atualizarFuncionario(current.id, data);
        setRows((p) =>
          p.map((r) => (r.id === current.id ? atualizado : r))
        );
      }
      setOpenDialog(false);
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      alert("Erro ao salvar funcionário. Veja o console para detalhes.");
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este funcionário?"))
      return;
    try {
      await deletarFuncionario(id);
      setRows((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
    }
  };

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.nome.toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.cargo ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
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
            Funcionários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os funcionários cadastrados
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar funcionário"
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
            Novo Funcionário
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
            <Typography fontWeight={600}>
              Nenhum funcionário encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo funcionário.
            </Typography>
          </Paper>
        ) : (
          filtered.map((f) => (
            <FuncionarioCard
              key={f.id}
              f={f}
              onEdit={openEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </Stack>

      <FuncionarioDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        oficinaId={user?.oficina_id ?? 0}
        onDelete={mode === "edit" ? (f) => onDelete(f.id) : undefined}
      />
    </Box>
  );
}

function FuncionarioCard({
  f,
  onEdit,
  onDelete,
}: {
  f: Funcionario;
  onEdit: (f: Funcionario) => void;
  onDelete: (id: number) => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <Paper
      elevation={0}
      sx={(t) => ({
        p: 2,
        borderRadius: 2,
        border: `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
          {f.nome[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap>
            {f.nome}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
          >
            {f.cargo ?? "—"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip
          label={f.telefone ?? "Sem telefone"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onEdit(f);
            }}
          >
            <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onDelete(f.id);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
