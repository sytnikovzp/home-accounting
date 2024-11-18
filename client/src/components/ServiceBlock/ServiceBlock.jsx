import { Box } from '@mui/material';
// ==============================================================
import CurrencyExchange from '../CurrencyExchange/CurrencyExchange';
import Calendar from '../Calendar/Calendar';

function ServiceBlock() {
  return (
    <Box
      sx={{
        position: { md: 'sticky', xs: 'static' },
        top: 0,
        minHeight: { md: '70vh', xs: 'auto' },
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: { md: 'flex-start', xs: 'center' },
        borderLeft: { md: '1px solid rgba(0, 0, 0, 0.1)', xs: 'none' },
        borderTop: { xs: '1px solid rgba(0, 0, 0, 0.1)', md: 'none' },
      }}
    >
      <CurrencyExchange />
      <Calendar />
    </Box>
  );
}

export default ServiceBlock;
