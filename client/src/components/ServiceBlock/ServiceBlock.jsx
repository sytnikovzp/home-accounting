import { Box } from '@mui/material';

import Calendar from '../Calendar/Calendar';
import CurrencyRates from '../CurrencyRates/CurrencyRates';

import { stylesServiceBlockBox } from '../../styles';

function ServiceBlock() {
  return (
    <Box sx={stylesServiceBlockBox}>
      <CurrencyRates />
      <Calendar />
    </Box>
  );
}

export default ServiceBlock;
