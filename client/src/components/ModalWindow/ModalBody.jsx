import Box from '@mui/material/Box';

import { stylesModalWindowContentBox } from '@/src/styles';

function ModalBody({ children }) {
  return (
    <Box id='modal-window-description' sx={stylesModalWindowContentBox}>
      {children}
    </Box>
  );
}

export default ModalBody;
