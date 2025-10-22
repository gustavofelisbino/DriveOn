import * as React from "react";
import {
  Dialog, DialogContent, DialogActions, Stack, TextField,
  Button, IconButton, Typography, Paper, Grid, InputAdornment
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";

export type EstoqueItem = {
  id: string;
  nome: string;
  descricao?: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  createdAt: string;
};

export type EstoqueForm = Omit<EstoqueItem, "id" | "createdAt">;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: EstoqueItem | null;
  onClose: () => void;
  onSubmit: (data: EstoqueForm) => void;
  onDelete?: (item: EstoqueItem) => void;
};

export default function EstoqueDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [form, setForm] = React.useState<EstoqueForm>({
    nome: "",
    descricao: "",
    preco_custo: 0,
    preco_venda: 0,
    estoque: 0,
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({
      nome: initial?.nome ?? "",
      descricao: initial?.descricao ?? "",
      preco_custo: initial?.preco_custo ?? 0,
      preco_venda: initial?.preco_venda ?? 0,
      estoque: initial?.estoque ?? 0,
    });
  }, [open, initial]);

  const handleChange = (field: keyof EstoqueForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.nome.trim()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
      <Paper
        elevation={0}
        square
        sx={{
          px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
          bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <HeaderIcon><Inventory2RoundedIcon /></HeaderIcon>
          <Stack spacing={0}>
            <Typography variant="subtitle1" fontWeight={800}>
              {mode === "create" ? "Novo item de estoque" : "Editar item"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha as informações do produto/peça
            </Typography>
          </Stack>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Paper>

      <DialogContent sx={{ px: 4, pt: 2, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              size="small"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><Inventory2RoundedIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={2}
              InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionRoundedIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Preço de custo (R$)"
              type="number"
              value={form.preco_custo}
              onChange={(e) => handleChange("preco_custo", parseFloat(e.target.value))}
              size="small"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><PaidRoundedIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Preço de venda (R$)"
              type="number"
              value={form.preco_venda}
              onChange={(e) => handleChange("preco_venda", parseFloat(e.target.value))}
              size="small"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><PaidRoundedIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Estoque"
              type="number"
              value={form.estoque}
              onChange={(e) => handleChange("estoque", parseInt(e.target.value))}
              size="small"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><NumbersRoundedIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {mode === "edit" && onDelete && initial?.id && (
          <Button color="error" onClick={() => { onDelete(initial!); onClose(); }}>
            Excluir
          </Button>
        )}
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 999 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 999 }}>
            Salvar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
        color: "primary.main",
        flexShrink: 0,
      }}
    >
      {children}
    </Stack>
  );
}
