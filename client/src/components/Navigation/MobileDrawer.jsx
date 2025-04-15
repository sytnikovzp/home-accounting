import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import CurrencyRates from '../CurrencyRates/CurrencyRates';

import NavBar from './NavBar';

import { stylesMobileDrawerBox } from '../../styles';

function MobileDrawer({ open, onClose }) {
  return (
    <Drawer anchor='left' open={open} onClose={onClose}>
      <Box sx={stylesMobileDrawerBox}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <NavBar onClose={onClose} />
        <CurrencyRates />
      </Box>
    </Drawer>
  );
}

export default MobileDrawer;
