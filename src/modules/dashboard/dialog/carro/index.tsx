import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export type CarForm = {
  brand: string;
  model: string;
  year: number | '';
  plate?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CarForm) => void;
  initialBrand?: string;
  initialModel?: string;
};

export default function DialogCarro({
  open, onClose, onCreate, initialBrand = '', initialModel = ''
}: Props) {
  const currentYear = new Date().getFullYear();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CarForm>({
    mode: 'onChange',
    defaultValues: {
      brand: initialBrand,
      model: initialModel,
      year: '',
      plate: '',
    }
  });

  React.useEffect(() => {
    if (open) {
      reset({
        brand: initialBrand,
        model: initialModel,
        year: '',
        plate: '',
      });
    }
  }, [open, reset, initialBrand, initialModel]);

  const onSubmit = (data: CarForm) => {
    const parsedYear =
      typeof data.year === 'string' ? parseInt(data.year, 10) : data.year;

    onCreate({
      ...data,
      year: isNaN(parsedYear) ? ('' as any) : parsedYear,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar carro</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={0.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="brand"
                control={control}
                rules={{
                  required: 'Informe a marca',
                  maxLength: { value: 50, message: 'Máx. 50 caracteres' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marca"
                    placeholder="Ex.: Honda, Peugeot..."
                    error={!!errors.brand}
                    helperText={errors.brand?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="model"
                control={control}
                rules={{
                  required: 'Informe o modelo',
                  maxLength: { value: 80, message: 'Máx. 80 caracteres' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Modelo"
                    placeholder="Ex.: Civic, 208..."
                    error={!!errors.model}
                    helperText={errors.model?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="year"
                control={control}
                rules={{
                  required: 'Informe o ano',
                  validate: (v) => {
                    const n = typeof v === 'string' ? parseInt(v, 10) : v;
                    if (!n || isNaN(n)) return 'Ano inválido';
                    if (n < 1900 || n > currentYear + 1) return `Ano deve estar entre 1900 e ${currentYear + 1}`;
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ano"
                    type="number"
                    placeholder="Ex.: 2014"
                    error={!!errors.year}
                    helperText={errors.year?.message}
                    fullWidth
                    inputProps={{ inputMode: 'numeric', min: 1900, max: currentYear + 1 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="plate"
                control={control}
                rules={{
                  maxLength: { value: 10, message: 'Máx. 10 caracteres' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Placa (opcional)"
                    placeholder="Ex.: ABC1D23"
                    error={!!errors.plate}
                    helperText={errors.plate?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={!isValid || isSubmitting}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
