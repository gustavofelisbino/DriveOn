import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton,
  Fade,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Controller, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

type HighlightMap = Record<string, number>;
type FormValues = {
  title: string;
  description?: string;
  start: Dayjs | null;
  end: Dayjs | null;
  location?: string;
};

function NewAppointmentDialog({
  open,
  onClose,
  onCreate,
  defaultStart,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: FormValues) => void;
  defaultStart?: Dayjs | null;
}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      start: defaultStart ?? dayjs().minute(0).second(0),
      end: (defaultStart ?? dayjs()).minute(0).second(0).add(1, 'hour'),
      location: '',
    },
  });

  React.useEffect(() => {
    if (open && defaultStart) {
      setValue('start', defaultStart.minute(0).second(0));
      setValue('end', defaultStart.minute(0).second(0).add(1, 'hour'));
    }
  }, [open, defaultStart, setValue]);

  const start = watch('start');

  const onSubmit = (data: FormValues) => {
    onCreate(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Novo agendamento</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Informe um título',
              maxLength: { value: 80, message: 'Máximo de 80 caracteres' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Título"
                placeholder="Ex.: Troca de óleo - Civic 2009"
                autoFocus
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ maxLength: { value: 500, message: 'Máximo de 500 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição"
                placeholder="Anotações, observações, peças necessárias…"
                multiline
                minRows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
              />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="start"
                control={control}
                rules={{ required: 'Informe a data/hora de início' }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Início"
                    ampm={false}
                    slotProps={{
                      textField: {
                        error: !!errors.start,
                        helperText: errors.start?.message,
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="end"
                control={control}
                rules={{
                  required: 'Informe a data/hora de término',
                  validate: (value) =>
                    value && start && dayjs(value).isAfter(start ?? dayjs())
                      ? true
                      : 'Término deve ser depois do início',
                }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Término"
                    ampm={false}
                    minDateTime={start ?? undefined}
                    slotProps={{
                      textField: {
                        error: !!errors.end,
                        helperText: errors.end?.message,
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Controller
            name="location"
            control={control}
            rules={{ maxLength: { value: 120, message: 'Máximo de 120 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Local (opcional)"
                placeholder="Oficina principal, Box 2…"
                error={!!errors.location}
                helperText={errors.location?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={!isValid || isSubmitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EventDay(
  props: Omit<PickersDayProps, 'day'> & { day: Dayjs; highlights?: HighlightMap }
) {
  const { day, outsideCurrentMonth, highlights = {}, selected, ...other } = props;
  const key = day.format('YYYY-MM-DD');
  const events = !outsideCurrentMonth ? (highlights[key] ?? 0) : 0;
  const isHighlighted = events > 0;

  return (
    <PickersDay
      {...other}
      day={day}
      selected={selected}
      outsideCurrentMonth={outsideCurrentMonth}
      disableMargin
      sx={(theme) => ({
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 'unset',
        aspectRatio: '1',
        lineHeight: 1,
        fontWeight: 600,
        borderRadius: 2,
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': { 
          transform: 'scale(1.05)',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        },
        ...(day.isSame(dayjs(), 'day') && {
          boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
        }),
        ...(selected && {
          bgcolor: 'primary.main',
          color: '#fff',
          '&:hover, &:focus': { bgcolor: 'primary.dark' },
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
        }),
        ...(isHighlighted && {
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: 4,
            transform: 'translateX(-50%)',
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: selected ? '#fff' : theme.palette.primary.main,
          },
        }),
      })}
    />
  );
}

export default function Schedule() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const highlights = useMemo<HighlightMap>(() => {
    const base = [6, 8, 20, 25];
    const map: HighlightMap = {};
    base.forEach((d) => {
      const k = dayjs().date(d).format('YYYY-MM-DD');
      map[k] = (map[k] ?? 0) + 1;
    });
    return map;
  }, []);

  const handleCreate = (data: FormValues) => {
    console.log('Novo agendamento:', {
      ...data,
      startISO: data.start?.toISOString(),
      endISO: data.end?.toISOString(),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        {/* Header */}
        <Stack spacing={0.5} mb={3}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 22, md: 24 } }}>
            Agenda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, fontWeight: 500 }}>
            {value ? value.format('dddd, DD [de] MMMM [de] YYYY') : 'Selecione uma data'}
          </Typography>
        </Stack>

        {/* Search & Actions */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          mb={2.5}
        >
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar agendamentos"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                borderRadius: 2,
                px: 2.5,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              Novo
            </Button>
            <IconButton
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: 'background.paper',
              }}
            >
              <FilterListRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Quick Filters */}
        <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap" gap={1}>
          <Chip 
            icon={<TodayRoundedIcon sx={{ fontSize: 16 }} />}
            label="Hoje" 
            onClick={() => setValue(dayjs())}
            sx={{
              fontWeight: 600,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
              color: 'primary.main',
              '&:hover': {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
              }
            }}
          />
          <Chip 
            label="Próximos 7 dias" 
            onClick={() => setValue(dayjs())} 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label="Com eventos" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Stack>

        {/* Calendar */}
        <Fade in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: (t) => `1px solid ${t.palette.divider}`,
              p: { xs: 2, sm: 3 },
              bgcolor: 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: (t) => `0 12px 40px ${alpha(t.palette.primary.main, 0.08)}`,
                borderColor: (t) => alpha(t.palette.primary.main, 0.3),
              },
            }}
          >
            <DateCalendar
              value={value}
              onChange={setValue}
              views={['day']}
              sx={{
                width: '100%',
                '& .MuiPickersCalendarHeader-root': { 
                  px: 1,
                  pb: 2,
                },
                '& .MuiPickersCalendarHeader-label': { 
                  fontWeight: 700, 
                  fontSize: 17,
                  color: 'text.primary',
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: 13,
                  flexBasis: 'calc(100% / 7)',
                  maxWidth: 'calc(100% / 7)',
                  textAlign: 'center',
                },
                '& .MuiDayCalendar-monthContainer': { pt: 1 },
                '& .MuiPickersSlideTransition-root': { minHeight: 320 },
                '& .MuiDayCalendar-weekContainer': {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 0.5,
                },
                '& .MuiPickersArrowSwitcher-root': {
                  gap: 1,
                  '& button': {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    color: 'primary.main',
                    borderRadius: 1.5,
                    width: 36,
                    height: 36,
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                      transform: 'scale(1.05)',
                    },
                  },
                },
              }}
              slots={{
                day: (dayProps) => <EventDay {...dayProps} highlights={highlights} />,
                leftArrowIcon: ArrowBackRoundedIcon,
                rightArrowIcon: ArrowForwardRoundedIcon,
              }}
              slotProps={{
                day: { disableMargin: true },
              }}
            />
          </Paper>
        </Fade>
      </Box>

      <NewAppointmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        defaultStart={value ? value.hour(9).minute(0).second(0) : dayjs().hour(9).minute(0)}
      />
    </LocalizationProvider>
  );
}