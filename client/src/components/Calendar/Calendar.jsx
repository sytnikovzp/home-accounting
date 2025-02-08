import { uk } from 'date-fns/locale/uk';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function Calendar() {
  return (
    <LocalizationProvider adapterLocale={uk} dateAdapter={AdapterDateFns}>
      <DateCalendar
        readOnly
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        views={['day']}
      />
    </LocalizationProvider>
  );
}

export default Calendar;
