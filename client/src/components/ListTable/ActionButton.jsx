import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import { stylesListTableActions } from '../../styles';

function ActionButton({ Icon, title, onClick }) {
  return (
    <TableCell align='center' sx={stylesListTableActions}>
      <Tooltip title={title}>
        <IconButton onClick={onClick}>
          <Icon />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export default ActionButton;
