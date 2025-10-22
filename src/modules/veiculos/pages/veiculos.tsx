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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import { useAuth } from "../../../context/AuthContext";
import VehicleDialog, { type Vehicle, type VehicleForm } from "../dialog";
import {
  listarVeiculos,
  criarVeiculo,
  atualizarVeiculo,
  excluirVeiculo,
} from "../api/api";

export default function VehiclesPage() {
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [current, setCurrent] = React.useState<Vehicle | null>(null);
  const [rows, setRows] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    listarVeiculos()
      .then(setRows)
      .catch((err) => console.error("Erro ao carregar veículos:", err));
  }, []);

  const openCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpenDialog(true);
  };

  const openEdit = (v: Vehicle) => {
    setMode("edit");
    setCurrent(v);
    setOpenDialog(true);
  };

  const onSubmit = async (data: VehicleForm) => {
    try {
      if (mode === "create") {
        const novo = await criarVeiculo(data);
        setRows((p) => [novo, ...p]);
      } else if (current) {
        const atualizado = await atualizarVeiculo(current.id, data);
        setRows((p) => p.map((r) => (r.id === current.id ? atualizado : r)));
      }
      setOpenDialog(false);
    } catch (err) {
      console.error("Erro ao salvar veículo:", err);
      alert("Erro ao salvar veículo. Veja o console para detalhes.");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await excluirVeiculo(id);
      setRows((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Erro ao excluir veículo:", err);
    }
  };

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.modelo.toLowerCase().includes(q) ||
      r.marca.toLowerCase().includes(q) ||
      r.placa.toLowerCase().includes(q) ||
      (r.cor ?? "").toLowerCase().includes(q)
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
            Veículos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os veículos cadastrados
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar veículo"
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
            Novo Veículo
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
            <Typography fontWeight={600}>Nenhum veículo encontrado</Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste a pesquisa ou cadastre um novo veículo.
            </Typography>
          </Paper>
        ) : (
          filtered.map((v) => (
            <VehicleCard
              key={v.id}
              v={v}
              onEdit={openEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </Stack>

      {/* Diálogo */}
      <VehicleDialog
        open={openDialog}
        mode={mode}
        initial={current}
        onClose={() => setOpenDialog(false)}
        onSubmit={onSubmit}
        onDelete={mode === "edit" ? (v) => onDelete(v.id) : undefined}
      />
    </Box>
  );
}

/* ==========================
   VehicleCard component
   ========================== */
function VehicleCard({
  v,
  onEdit,
  onDelete,
}: {
  v: Vehicle;
  onEdit: (v: Vehicle) => void;
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      })}
    >
      {/* Informações principais */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
        <DirectionsCarRoundedIcon color="primary" />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap>
            {v.marca} {v.modelo}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
            <CreditCardRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
            <Typography variant="caption">{v.placa}</Typography>
            {v.cor && (
              <>
                <ColorLensRoundedIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                <Typography variant="caption">{v.cor}</Typography>
              </>
            )}
          </Stack>
          {v.cliente && (
            <Typography variant="caption" color="text.secondary" noWrap>
              Cliente: {v.cliente}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Ações */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip label={v.ano ?? "—"} size="small" sx={{ fontWeight: 600 }} />
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
              onEdit(v);
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onDelete(v.id);
            }}
            sx={{ color: "error.main" }}
          >
            Excluir
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
