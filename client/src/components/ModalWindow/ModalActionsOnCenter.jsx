import Box from '@mui/material/Box';

import { stylesModalWindowActionsOnCenter } from '../../styles';

function ModalActionsOnCenter({ children }) {
  return <Box sx={stylesModalWindowActionsOnCenter}>{children}</Box>;
}

export default ModalActionsOnCenter;
