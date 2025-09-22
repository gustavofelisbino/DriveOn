import * as React from "react";
import {
  Dialog, DialogContent, DialogActions, Stack, TextField, Button, IconButton, Typography,
  MenuItem, InputAdornment, Paper, Divider, Table, TableHead, TableRow, TableCell, TableBody, Chip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import type {
  ItemOsDto, OrdemServicoCriarDto, OrdemServicoDetalhe, OsTipo
} from '../../../types/ordemservico';

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function HeaderIconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Stack sx={{
      width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
      bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: "primary.main", flexShrink: 0,
    }}>
      {children}
    </Stack>
  );
}

type Props = {
  open: boolean;
  mode: "create" | "view";
  detail?: OrdemServicoDetalhe | null;
  onClose: () => void;
  onCreate?: (dto: OrdemServicoCriarDto) => Promise<void> | void;
  onFinalize?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export default function OrderDialog({
  open, mode, detail, onClose, onCreate, onFinalize, onDelete,
}: Props) {
  // --- estado de criação ---
  const [tipo, setTipo] = React.useState<OsTipo>("servico");
  const [clienteId, setClienteId] = React.useState<number | "">("");
  const [veiculoId, setVeiculoId] = React.useState<number | "">("");
  const [descricao, setDescricao] = React.useState("");
  const [descontoValor, setDescontoValor] = React.useState<number | "">("");
  const [itens, setItens] = React.useState<ItemOsDto[]>([
    { descricao: "", quantidade: 1, precoUnitario: 0 },
  ]);

  React.useEffect(() => {
    if (!open || mode !== "create") return;
    setTipo("servico");
    setClienteId("");
    setVeiculoId("");
    setDescricao("");
    setDescontoValor("");
    setItens([{ descricao: "", quantidade: 1, precoUnitario: 0 }]);
  }, [open, mode]);

  const subtotal = itens.reduce((acc, it) => acc + (Number(it.quantidade) || 0) * (Number(it.precoUnitario) || 0), 0);
  const total = Math.max(0, subtotal - (Number(descontoValor) || 0));

  const addItem = () => setItens((p) => [...p, { descricao: "", quantidade: 1, precoUnitario: 0 }]);
  const removeItem = (i: number) => setItens((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (idx: number, patch: Partial<ItemOsDto>) =>
    setItens((p) => p.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const canSubmit =
    mode === "create" &&
    clienteId !== "" &&
    veiculoId !== "" &&
    itens.length > 0 &&
    itens.every((it) => (it.itemId || (it.descricao && it.descricao.trim().length > 0)) && (it.quantidade || 0) > 0);

  const headerIcon = mode === "create" ? <AddTaskRoundedIcon /> : <VisibilityRoundedIcon />;

  const handleCreate = async () => {
    if (!canSubmit || !onCreate) return;
    const dto: OrdemServicoCriarDto = {
      tipo,
      clienteId: Number(clienteId),
      veiculoId: Number(veiculoId),
      descricao: descricao.trim() || undefined,
      descontoValor: Number(descontoValor) || 0,
      itens: itens.map((it) => ({
        itemId: it.itemId ?? undefined,
        descricao: it.itemId ? undefined : (it.descricao?.trim() || undefined),
        quantidade: Number(it.quantidade) || 0,
        precoUnitario: Number(it.precoUnitario) || 0,
      })),
    };
    await onCreate(dto);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
      <Paper elevation={0} square sx={{
        px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
        bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <HeaderIconWrapper>{headerIcon}</HeaderIconWrapper>
          <Stack spacing={0}>
            <Typography variant="subtitle1" fontWeight={800}>
              {mode === "create" ? "Nova Ordem de Serviço" : `OS #${detail?.id}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === "create" ? "Preencha os campos e salve para criar a OS" : "Detalhes da ordem de serviço"}
            </Typography>
          </Stack>
        </Stack>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </Paper>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        {mode === "create" ? (
          <Stack spacing={2.25}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value as OsTipo)} sx={{ minWidth: 180 }}>
                <MenuItem value="servico">Serviço</MenuItem>
                <MenuItem value="manutencao">Manutenção</MenuItem>
              </TextField>
              <TextField type="number" label="Cliente (ID)" value={clienteId} onChange={(e) => setClienteId(e.target.value === "" ? "" : Number(e.target.value))} />
              <TextField type="number" label="Veículo (ID)" value={veiculoId} onChange={(e) => setVeiculoId(e.target.value === "" ? "" : Number(e.target.value))} />
            </Stack>

            <TextField
              label="Descrição (opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)}
              multiline minRows={2} InputProps={{ startAdornment: <InputAdornment position="start"><NotesRoundedIcon fontSize="small" /></InputAdornment> }}
            />

            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 60 }}>#</TableCell>
                    <TableCell>Descrição do item</TableCell>
                    <TableCell align="right" sx={{ width: 120 }}>Qtd</TableCell>
                    <TableCell align="right" sx={{ width: 140 }}>Preço unit.</TableCell>
                    <TableCell align="right" sx={{ width: 140 }}>Total</TableCell>
                    <TableCell align="right" sx={{ width: 80 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itens.map((it, i) => {
                    const tot = (Number(it.quantidade) || 0) * (Number(it.precoUnitario) || 0);
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          <TextField placeholder="Descrição do serviço/peça" fullWidth value={it.descricao ?? ""} onChange={(e) => updateItem(i, { descricao: e.target.value })} />
                        </TableCell>
                        <TableCell align="right">
                          <TextField type="number" inputProps={{ step: "0.01" }} value={it.quantidade} onChange={(e) => updateItem(i, { quantidade: Number(e.target.value) })} sx={{ width: 110 }} />
                        </TableCell>
                        <TableCell align="right">
                          <TextField type="number" inputProps={{ step: "0.01" }} value={it.precoUnitario} onChange={(e) => updateItem(i, { precoUnitario: Number(e.target.value) })} sx={{ width: 130 }} />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{currency.format(tot)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => removeItem(i)}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5 }}>
                <Button onClick={addItem}>Adicionar item</Button>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Typography>Subtotal: <b>{currency.format(subtotal)}</b></Typography>
                  <TextField
                    label="Desconto (R$)" type="number" inputProps={{ step: "0.01" }} value={descontoValor}
                    onChange={(e) => setDescontoValor(e.target.value === "" ? "" : Number(e.target.value))}
                    sx={{ width: 160 }}
                  />
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="h6">Total: <b>{currency.format(total)}</b></Typography>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          detail && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`Status: ${detail.status}`} />
                <Chip label={`Tipo: ${detail.tipo}`} />
                <Chip label={`Cliente #${detail.clienteId}`} />
                <Chip label={`Veículo #${detail.veiculoId}`} />
                <Chip color="success" label={`Total: ${currency.format(detail.valorTotal)}`} />
              </Stack>

              {detail.descricao && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Descrição</Typography>
                  <Typography variant="body2" color="text.secondary">{detail.descricao}</Typography>
                </Paper>
              )}

              <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qtd</TableCell>
                      <TableCell align="right">Preço unit.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detail.itens.map((it, i) => (
                      <TableRow key={it.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{it.descricao || `Item ${it.itemId ?? ""}`}</TableCell>
                        <TableCell align="right">{it.quantidade}</TableCell>
                        <TableCell align="right">{currency.format(it.precoUnitario)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{currency.format(it.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Stack direction="row" justifyContent="flex-end" spacing={3} sx={{ p: 1.5 }}>
                  <Typography>Desconto: <b>{currency.format(detail.descontoValor)}</b></Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="h6">Total: <b>{currency.format(detail.valorTotal)}</b></Typography>
                </Stack>
              </Paper>
            </Stack>
          )
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        {mode === "view" ? (
          <>
            {onDelete && <Button color="error" startIcon={<DeleteRoundedIcon />} onClick={onDelete}>Excluir</Button>}
            {onFinalize && detail?.status === "aberta" && (
              <Button startIcon={<CheckCircleRoundedIcon />} onClick={onFinalize}>Finalizar OS</Button>
            )}
            <Button onClick={onClose} sx={{ ml: "auto" }}>Fechar</Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate} disabled={!canSubmit}>Criar OS</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
