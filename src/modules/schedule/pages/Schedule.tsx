import { useState } from 'react';
import {
  Box, Stack, Typography, Paper, InputBase, Button
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

function EventDay(
  props: PickersDayProps & { highlightedDays?: number[] }
) {
  const { day, outsideCurrentMonth, highlightedDays = [], ...other } = props;
  const isHighlighted =
    !outsideCurrentMonth && highlightedDays.includes(day.date());

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        width: 44,
        height: 44,
        fontWeight: 600,
        mx: 'auto',
        ...(isHighlighted && {
          bgcolor: 'primary.main',
          color: '#fff',
          '&:hover, &:focus': { bgcolor: 'primary.main' },
        }),
      }}
    />
  );
}

export default function Schedule() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const highlightedDays = [6, 8, 20, 25];

  const arrowBtnSx = {
    bgcolor: 'primary.main',
    color: '#fff',
    borderRadius: 2,
    width: 44,
    height: 44,
    '&:hover': { bgcolor: 'primary.main' },
  } as const;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ mr: 1 }}>Agendamentos</Typography>

          <Paper variant="outlined" sx={{ display:'flex', alignItems:'center', justifyContent:'center', width:{ xs:'100%', sm:420 }, height:44, borderRadius:'12px', bgcolor:'#fff' }}>
            <SearchRoundedIcon sx={{ ml: 10 }} />
            <InputBase placeholder="Pesquisar agendamentos" sx={{ ml: 1, flex: 1 }} />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="contained" startIcon={<AddRoundedIcon />} sx={{ borderRadius:999, height:44, px:2.5 }}>
            Novo Agendamento
          </Button>
          <Button variant="outlined" startIcon={<FilterListRoundedIcon />} sx={{ borderRadius:2, height:44, px:2.5, bgcolor:'#fff' }}>
            Filtros
          </Button>
        </Stack>

        <Box display="flex" justifyContent="center">
          <DateCalendar
            value={value}
            onChange={setValue}
            views={['day']}
            sx={{
              '& .MuiPickersCalendarHeader-label': { fontWeight: 700 },
              '& .MuiDayCalendar-weekDayLabel': { color: 'text.secondary' },
              '& .MuiDayCalendar-monthContainer': { pt: 2 },
              width: '50%',
            }}
            slots={{
              day: (dayProps) => <EventDay {...dayProps} highlightedDays={highlightedDays} />,
              leftArrowIcon: ArrowBackRoundedIcon,
              rightArrowIcon: ArrowForwardRoundedIcon,
            }}
            slotProps={{
              calendarHeader: {
                sx: { 
                  '& .MuiPickersArrowSwitcher-root': { 
                    gap: 2,
                    '& button': arrowBtnSx
                  } 
                }
              }
            }}
          />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}
