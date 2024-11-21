import { Box } from '@mui/material';
// ==============================================================
import { stylesServiceBlockBox } from '../../styles/theme';
// ==============================================================
import CurrencyExchange from '../CurrencyExchange/CurrencyExchange';
import Calendar from '../Calendar/Calendar';

function ServiceBlock() {
  return (
    <Box sx={stylesServiceBlockBox}>
      <CurrencyExchange />
      <Calendar />
    </Box>
  );
}

export default ServiceBlock;
