import Box from '@mui/material/Box';

function ModalActionsOnRight({ children }) {
  return (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
      {children}
    </Box>
  );
}

export default ModalActionsOnRight;
