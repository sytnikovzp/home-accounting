import Box from '@mui/material/Box';

import { stylesModalWindowActionsOnCenter } from '@/src/styles';

function ModalActionsOnCenter({ children }) {
  return <Box sx={stylesModalWindowActionsOnCenter}>{children}</Box>;
}

export default ModalActionsOnCenter;
