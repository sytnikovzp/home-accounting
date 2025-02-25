import Box from '@mui/material/Box';

import CurrencyRates from '../CurrencyRates/CurrencyRates';
import NavBar from '../Navigation/NavBar';

import { stylesSideBarBox } from '../../styles';

function SideBar() {
  return (
    <Box sx={stylesSideBarBox}>
      <NavBar />
      <CurrencyRates />
    </Box>
  );
}

export default SideBar;
