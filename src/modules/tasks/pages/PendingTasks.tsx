import * as React from "react";
import {
  Box, Stack, Paper, Typography, TextField, InputAdornment,
  Button, IconButton, Tooltip, Divider, Chip, Menu, MenuItem
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import OrderDialog from "./../dialog";
import {
  listarOrdens, obterOrdem, criarOrdem, finalizarOrdem, excluirOrdem
} from '../../../services/ordemservico';
import type {
  OrdemServicoCriarDto, OrdemServicoDetalhe, OrdemServicoListaDto, OsStatus
} from '../../../types/ordemservico';

dayjs.locale("pt-br");

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (iso: string) => dayjs(iso).format("DD/MM/YYYY HH:mm");

function SoftButton(props: React.ComponentProps<typeof Button>) {
  const { sx, ...rest } = props;
  return (
    <Button
      variant="text"
      {...rest}
      sx={{
        borderRadius: 999, px: 1.75, py: 0.75, fontWeight: 600, textTransform: "none",
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
        ...sx,
      }}
    />
  );
}

function StatusChip({ status }: { status: OsStatus }) {
  const map: Record<OsStatus, { color: string; label: string }> = {
    aberta:     { color: "warning.main", label: "Aberta" },
    finalizada: { color: "success.main", label: "Finalizada" },
    cancelada:  { color: "error.main",   label: "Cancelada" },
  };
  const cfg = map[status];
  return (
    <Chip
      size="small"
      label={<Stack direction="row" spacing={1} alignItems="center">
        <CircleIcon sx={{ fontSize: 8, color: cfg.color }} />
        <span>{cfg.label}</span>
      </Stack>}
      sx={{ borderRadius: 999, bgcolor: (t) => alpha(t.palette.text.primary, 0.06), "& .MuiChip-label": { px: 1 } }}
    />
  );
}

function OsPill({
  os, onView, onFinalize, onDelete,
}: {
  os: OrdemServicoListaDto;
  onView: (id: number) => void;
  onFinalize: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Paper elevation={0} sx={{
      px: 2, py: 1.25, borderRadius: 999,
      border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.18)}`,
      bgcolor: "background.paper",
      transition: "transform .12s ease, background-color .15s ease, border-color .15s ease",
      "&:hover": { transform: "translateY(-1px)", borderColor: (t) => alpha(t.palette.primary.main, 0.35), bgcolor: (t) => alpha(t.palette.primary.main, 0.03) },
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 220 }}>
          OS #{os.id} — {os.tipo === "servico" ? "Serviço" : "Manutenção"}
        </Typography>

        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 220, flex: 1 }}>
          <CalendarMonthRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {fmtDate(os.abertaEm)}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            Cliente #{os.clienteId} • Veículo #{os.veiculoId}
          </Typography>
        </Stack>

        <Chip
          size="small"
          label={currency.format(os.valorTotal)}
          sx={{ height: 24, borderRadius: 999, bgcolor: (t) => alpha(t.palette.success.main, 0.1), color: "success.main", fontWeight: 700 }}
        />

        <StatusChip status={os.status} />

        <Divider orientation="vertical" flexItem sx={{ mx: 1.25, my: 0.5 }} />

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => onView(os.id)}><VisibilityRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
          {os.status === "aberta" && (
            <Tooltip title="Finalizar OS">
              <IconButton size="small" onClick={() => onFinalize(os.id)}><CheckCircleRoundedIcon fontSize="small" /></IconButton>
            </Tooltip>
          )}
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => onDelete(os.id)}><DeleteRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

function Filters({
  value, onChange,
}: {
  value: "todas" | OsStatus;
  onChange: (val: "todas" | OsStatus) => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  return (
    <>
      <Button variant="outlined" onClick={(e) => setAnchor(e.currentTarget)} startIcon={<TuneRoundedIcon />} sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}>
        {value === "todas" ? "Filtros" : `Status: ${value}`}
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { onChange("todas"); setAnchor(null); }}>Todas</MenuItem>
        <MenuItem onClick={() => { onChange("aberta"); setAnchor(null); }}>Abertas</MenuItem>
        <MenuItem onClick={() => { onChange("finalizada"); setAnchor(null); }}>Finalizadas</MenuItem>
        <MenuItem onClick={() => { onChange("cancelada"); setAnchor(null); }}>Canceladas</MenuItem>
      </Menu>
    </>
  );
}

export default function ServiceOrdersPage() {
  const [rows, setRows] = React.useState<OrdemServicoListaDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"todas" | OsStatus>("todas");

  // dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"create" | "view">("create");
  const [detail, setDetail] = React.useState<OrdemServicoDetalhe | null>(null);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarOrdens(statusFilter === "todas" ? {} : { status: statusFilter });
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => { fetchList(); }, [fetchList]);

  const openCreate = () => { setDialogMode("create"); setDetail(null); setDialogOpen(true); };

  const openView = async (id: number) => {
    const data = await obterOrdem(id);
    setDetail(data);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleCreate = async (dto: OrdemServicoCriarDto) => {
    await criarOrdem(dto);
    await fetchList();
  };

  const finalizeOs = async (id: number) => {
    await finalizarOrdem(id);
    await fetchList();
  };

  const deleteOs = async (id: number) => {
    await excluirOrdem(id);
    await fetchList();
  };

  const filtered = rows.filter((o) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      String(o.id).includes(term) ||
      String(o.clienteId).includes(term) ||
      String(o.veiculoId).includes(term) ||
      o.tipo.includes(term) ||
      o.status.includes(term)
    );
  });

  return (
    <Box sx={{ maxWidth: 1600, mx: "auto", px: { xs: 2, md: 4, lg: 6 }, py: { xs: 2, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={700}>Ordens de Serviço</Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por #OS, cliente, veículo, tipo ou status"
            size="small"
            sx={{ minWidth: { xs: "100%", md: 360 }, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "background.paper" } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
          <SoftButton startIcon={<AddRoundedIcon />} onClick={openCreate}>Nova OS</SoftButton>
          <Filters value={statusFilter} onChange={setStatusFilter} />
        </Stack>
      </Stack>

      {loading && <Paper variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>Carregando…</Paper>}

      {!loading && filtered.length === 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: "center", bgcolor: (t) => alpha(t.palette.primary.main, 0.02) }}>
          <Typography fontWeight={600}>Nenhuma OS encontrada</Typography>
          <Typography variant="body2" color="text.secondary">Ajuste a busca/filtro ou crie uma nova ordem.</Typography>
        </Paper>
      )}

      <Stack spacing={1.25}>
        {filtered.map((o) => (
          <OsPill key={o.id} os={o} onView={openView} onFinalize={finalizeOs} onDelete={deleteOs} />
        ))}
      </Stack>

      <OrderDialog
        open={dialogOpen}
        mode={dialogMode}
        detail={detail}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        onFinalize={detail?.id ? () => finalizeOs(detail.id) : undefined}
        onDelete={detail?.id ? () => deleteOs(detail.id) : undefined}
      />
    </Box>
  );
}
