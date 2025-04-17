import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CurrencyRates from '../CurrencyRates/CurrencyRates';

import NavBar from './NavBar';

import {
  stylesMobileDrawerBox,
  stylesMobileDrawerBoxIcon,
  stylesMobileDrawerDrawer,
} from '../../styles';

function MobileDrawer({ open, onClose }) {
  return (
    <Drawer
      anchor='left'
      open={open}
      slotProps={stylesMobileDrawerDrawer}
      onClose={onClose}
    >
      <Box sx={stylesMobileDrawerBox}>
        <Box sx={stylesMobileDrawerBoxIcon}>
          <IconButton onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <NavBar onClose={onClose} />
        <CurrencyRates />
      </Box>
    </Drawer>
  );
}

export default MobileDrawer;
