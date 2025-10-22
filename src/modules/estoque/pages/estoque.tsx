import * as React from "react";
import {
  Box, Stack, Typography, TextField, InputAdornment,
  Button, IconButton, Paper, Menu, MenuItem, Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import EstoqueDialog, { type EstoqueItem, type EstoqueForm } from "../dialog/index";

export default function EstoquePage() {
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<EstoqueItem | null>(null);
  const [rows, setRows] = React.useState<EstoqueItem[]>([]);

  const openCreate = () => { setMode("create"); setCurrent(null); setOpenDialog(true); };
  const openEdit = (i: EstoqueItem) => { setMode("edit"); setCurrent(i); setOpenDialog(true); };

  const onSubmit = (data: EstoqueForm) => {
    if (mode === "create") {
      const novo: EstoqueItem = {
        id: String(Date.now()),
        nome: data.nome,
        descricao: data.descricao,
        preco_custo: data.preco_custo,
        preco_venda: data.preco_venda,
        estoque: data.estoque,
        createdAt: new Date().toISOString(),
      };
      setRows((p) => [novo, ...p]);
    } else if (current) {
      setRows((p) => p.map((r) => (r.id === current.id ? { ...r, ...data } : r)));
    }
  };

  const onDelete = (id: string) => setRows((p) => p.filter((x) => x.id !== id));

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.nome.toLowerCase().includes(q) ||
      (r.descricao ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>Estoque</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie as peças e produtos da oficina
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar item"
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
            Novo item
          </Button>
        </Stack>
      </Stack>

      {/* Lista */}
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
            <Typography fontWeight={600}>Nenhum item encontrado</Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo item de estoque.
            </Typography>
          </Paper>
        ) : (
          filtered.map((i) => (
            <EstoqueCard key={i.id} i={i} onEdit={openEdit} onDelete={onDelete} />
          ))
        )}
      </Stack>

      {/* Dialog */}
      <EstoqueDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        onDelete={(i) => onDelete(i.id)}
      />
    </Box>
  );
}

function EstoqueCard({
  i,
  onEdit,
  onDelete,
}: {
  i: EstoqueItem;
  onEdit: (i: EstoqueItem) => void;
  onDelete: (id: string) => void;
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
          <Inventory2RoundedIcon color="primary" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {i.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {i.descricao || "Sem descrição"}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">Custo</Typography>
            <Typography variant="subtitle2">R$ {i.preco_custo.toFixed(2)}</Typography>
          </Stack>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">Venda</Typography>
            <Typography variant="subtitle2" color="success.main">R$ {i.preco_venda.toFixed(2)}</Typography>
          </Stack>
          <Stack spacing={0} alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">Estoque</Typography>
            <Typography variant="subtitle2" color={i.estoque > 0 ? "primary.main" : "error.main"}>
              {i.estoque}
            </Typography>
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
          <MenuItem onClick={() => { setAnchor(null); onEdit(i); }}>Editar</MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); onDelete(i.id); }} sx={{ color: "error.main" }}>
            Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
