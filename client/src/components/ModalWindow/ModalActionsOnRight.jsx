import Box from '@mui/material/Box';

import { stylesModalWindowActionsOnRight } from '../../styles';

function ModalActionsOnRight({ children }) {
  return <Box sx={stylesModalWindowActionsOnRight}>{children}</Box>;
}

export default ModalActionsOnRight;
