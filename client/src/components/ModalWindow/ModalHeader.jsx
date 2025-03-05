import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ModalHeader({ children }) {
  return (
    <Box id='modal-window-title' mb={2}>
      <Typography variant='h6'>{children}</Typography>
    </Box>
  );
}

export default ModalHeader;
