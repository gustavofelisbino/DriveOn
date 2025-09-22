import * as React from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  Stack, TextField, Button, MenuItem, InputAdornment
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import type { TaskCreateDto, TaskDetalhe, TaskPriority, TaskStatus, TaskUpdateDto } from '../../../types/tarefa';

type Mode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: Mode;
  detail?: TaskDetalhe | null;
  onClose: () => void;
  onCreate?: (dto: TaskCreateDto) => Promise<void> | void;
  onUpdate?: (dto: TaskUpdateDto) => Promise<void> | void;
};

const prioridadeOptions: TaskPriority[] = ['baixa', 'media', 'alta'];
const statusOptions: TaskStatus[] = ['pendente', 'em_andamento', 'concluida', 'cancelada'];

export default function TaskDialog({ open, mode, detail, onClose, onCreate, onUpdate }: Props) {
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  const [titulo, setTitulo] = React.useState('');
  const [descricao, setDescricao] = React.useState('');
  const [prioridade, setPrioridade] = React.useState<TaskPriority>('media');
  const [status, setStatus] = React.useState<TaskStatus>('pendente');
  const [venceEm, setVenceEm] = React.useState<string>('');
  const [ordemServicoId, setOsId] = React.useState<number | ''>('');
  const [clienteId, setClienteId] = React.useState<number | ''>('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setTitulo('');
      setDescricao('');
      setPrioridade('media');
      setStatus('pendente');
      setVenceEm('');
      setOsId('');
      setClienteId('');
      return;
    }
    if (detail) {
      setTitulo(detail.titulo);
      setDescricao(detail.descricao ?? '');
      setPrioridade(detail.prioridade);
      setStatus(detail.status);
      setVenceEm(detail.venceEm ? detail.venceEm.slice(0, 16) : ''); // datetime-local
      setOsId(detail.ordemServicoId ?? '');
      setClienteId(detail.clienteId ?? '');
    }
  }, [open, isCreate, detail]);

  const canSubmitCreate = isCreate && titulo.trim().length > 0;
  const canSubmitEdit = isEdit && titulo.trim().length > 0;

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (isCreate && onCreate) {
        const dto: TaskCreateDto = {
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
          prioridade,
          venceEm: venceEm ? new Date(venceEm).toISOString() : undefined,
          ordemServicoId: ordemServicoId === '' ? undefined : Number(ordemServicoId),
          clienteId: clienteId === '' ? undefined : Number(clienteId),
        };
        await onCreate(dto);
        onClose();
      } else if (isEdit && onUpdate && detail) {
        const dto: TaskUpdateDto = {
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
          prioridade,
          status,
          venceEm: venceEm ? new Date(venceEm).toISOString() : undefined,
          ordemServicoId: ordemServicoId === '' ? undefined : Number(ordemServicoId),
          clienteId: clienteId === '' ? undefined : Number(clienteId),
        };
        await onUpdate(dto);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}>
        {isCreate ? 'Nova Tarefa' : isEdit ? `Editar Tarefa #${detail?.id}` : `Tarefa #${detail?.id}`}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.25}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={isView}
            autoFocus
            fullWidth
          />

          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isView}
            fullWidth
            multiline
            minRows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as TaskPriority)}
              disabled={isView}
              sx={{ minWidth: 160 }}
            >
              {prioridadeOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p === 'baixa' ? 'Baixa' : p === 'media' ? 'Média' : 'Alta'}
                </MenuItem>
              ))}
            </TextField>

            {!isCreate && (
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={isView}
                sx={{ minWidth: 180 }}
              >
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              type="datetime-local"
              label="Vence em"
              value={venceEm}
              onChange={(e) => setVenceEm(e.target.value)}
              disabled={isView}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 220 }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              type="number"
              label="OS relacionada (ID)"
              value={ordemServicoId}
              onChange={(e) => setOsId(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isView}
            />
            <TextField
              type="number"
              label="Cliente (ID)"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isView}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Fechar</Button>
        {(isCreate || isEdit) && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || (isCreate ? !canSubmitCreate : !canSubmitEdit)}
          >
            {isCreate ? 'Criar' : 'Salvar alterações'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
