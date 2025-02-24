import Box from '@mui/material/Box';

import CurrencyRates from '../CurrencyRates/CurrencyRates';
import NavBar from '../Navigation/NavBar';

function SideBar() {
  return (
    <Box>
      <NavBar />
      <CurrencyRates />
    </Box>
  );
}

export default SideBar;
