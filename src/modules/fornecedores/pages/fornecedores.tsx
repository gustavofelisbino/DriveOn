import * as React from "react";
import {
  Box, Stack, Typography, TextField, InputAdornment, Button,
  IconButton, Paper, Menu, MenuItem, Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SupplierDialog, { type Supplier, type SupplierForm } from "../dialog/index";

export default function SuppliersPage() {
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<Supplier | null>(null);
  const [rows, setRows] = React.useState<Supplier[]>([]);

  const openCreate = () => { setMode("create"); setCurrent(null); setOpenDialog(true); };
  const openEdit = (s: Supplier) => { setMode("edit"); setCurrent(s); setOpenDialog(true); };

  const onSubmit = (data: SupplierForm) => {
    if (mode === "create") {
      const novo: Supplier = {
        id: String(Date.now()),
        nome: data.nome,
        contato: data.contato,
        telefone: data.telefone,
        email: data.email,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        cep: data.cep,
        cidade: data.cidade,
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
      (r.contato ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack spacing={0.3}>
          <Typography variant="h5" fontWeight={700}>Fornecedores</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os fornecedores de peças e serviços
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar fornecedor"
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
            Novo fornecedor
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
            <Typography fontWeight={600}>Nenhum fornecedor encontrado</Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo fornecedor.
            </Typography>
          </Paper>
        ) : (
          filtered.map((s) => (
            <SupplierCard key={s.id} s={s} onEdit={openEdit} onDelete={onDelete} />
          ))
        )}
      </Stack>

      {/* Dialog */}
      <SupplierDialog
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

function SupplierCard({
  s,
  onEdit,
  onDelete,
}: {
  s: Supplier;
  onEdit: (s: Supplier) => void;
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
          <BusinessRoundedIcon color="primary" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {s.nome}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
              {s.email && (
                <>
                  <EmailRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <Typography variant="caption">{s.email}</Typography>
                </>
              )}
              {s.telefone && (
                <>
                  <PhoneRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <Typography variant="caption">{s.telefone}</Typography>
                </>
              )}
            </Stack>
          </Box>
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
