import Box from '@mui/material/Box';

function ModalActionsOnCenter({ children }) {
  return (
    <Box display='flex' gap={2} justifyContent='center' mt={2}>
      {children}
    </Box>
  );
}

export default ModalActionsOnCenter;
