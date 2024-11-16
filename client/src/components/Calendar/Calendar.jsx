import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { uk } from 'date-fns/locale';

function Calendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
      <DateCalendar />
    </LocalizationProvider>
  );
}

export default Calendar;
