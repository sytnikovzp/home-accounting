import { Box } from '@mui/material';
// ==============================================================
import CurrencyExchange from '../CurrencyExchange/CurrencyExchange';
import Calendar from '../Calendar/Calendar';

function ServiceBlock() {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        minHeight: '70vh',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <CurrencyExchange />
      <Calendar />
    </Box>
  );
}

export default ServiceBlock;
