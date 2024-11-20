import { Box } from '@mui/material';
// ==============================================================
import { stylesServiceBlockBox } from '../../services/styleService';
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
