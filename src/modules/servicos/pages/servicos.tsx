import * as React from "react";
import {
  Box, Stack, Typography, TextField, InputAdornment,
  Button, Paper, IconButton, Menu, MenuItem, Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import { useAuth } from "../../../context/AuthContext";
import ServicoDialog, { type Servico, type ServicoForm } from "../dialog";
import {
  listarServicos,
  criarServico,
  atualizarServico,
  excluirServico,
} from "../api/api";

export default function ServicosPage() {
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<Servico | null>(null);
  const [rows, setRows] = React.useState<Servico[]>([]);

  React.useEffect(() => {
    listarServicos()
      .then(setRows)
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

  const openCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpenDialog(true);
  };

  const openEdit = (s: Servico) => {
    setMode("edit");
    setCurrent(s);
    setOpenDialog(true);
  };

  const onSubmit = async (data: ServicoForm) => {
    try {
      if (!user?.oficinaId) {
        alert("Usuário sem oficina vinculada.");
        return;
      }
      if (mode === "create") {
        const novo = await criarServico(data, user.oficinaId);
        setRows((p) => [novo, ...p]);
      } else if (current) {
        const atualizado = await atualizarServico(current.id, data);
        setRows((p) => p.map((r) => (r.id === current.id ? atualizado : r)));
      }
      setOpenDialog(false);
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      alert("Erro ao salvar serviço. Veja o console para detalhes.");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await excluirServico(id);
      setRows((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
    }
  };

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.nome.toLowerCase().includes(q) ||
      (r.descricao ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>Serviços</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os serviços disponíveis na sua oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar serviço"
            size="small"
            sx={{
              minWidth: 300,
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
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate} sx={{ borderRadius: 2 }}>
            Novo serviço
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
            <Typography fontWeight={600}>Nenhum serviço encontrado</Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo serviço.
            </Typography>
          </Paper>
        ) : (
          filtered.map((s) => (
            <ServicoCard key={s.id} s={s} onEdit={openEdit} onDelete={onDelete} />
          ))
        )}
      </Stack>

      <ServicoDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        onDelete={(s) => onDelete(s.id)}
      />
    </Box>
  );
}

function ServicoCard({
  s,
  onEdit,
  onDelete,
}: {
  s: Servico;
  onEdit: (s: Servico) => void;
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
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <BuildRoundedIcon color="primary" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {s.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {s.descricao || "Sem descrição"}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">Preço</Typography>
            <Typography variant="subtitle2" color="success.main">R$ {Number(s.preco).toFixed(2)}</Typography>
          </Stack>
        </Stack>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          PaperProps={{ sx: { mt: 1, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` } }}
        >
          <MenuItem onClick={() => { setAnchor(null); onEdit(s); }}>Editar</MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); onDelete(s.id); }} sx={{ color: "error.main" }}>
            Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
