import { Box } from '@mui/material';

import Calendar from '../Calendar/Calendar';
import CurrencyExchange from '../CurrencyExchange/CurrencyExchange';

import { stylesServiceBlockBox } from '../../styles';

function ServiceBlock() {
  return (
    <Box sx={stylesServiceBlockBox}>
      <CurrencyExchange />
      <Calendar />
    </Box>
  );
}

export default ServiceBlock;
