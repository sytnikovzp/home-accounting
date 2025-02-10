import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import { stylesListTableActions } from '../../styles';

function ActionButton({ title, Icon, disabled, onClick }) {
  return (
    <TableCell align='center' sx={stylesListTableActions}>
      <Tooltip title={title}>
        <IconButton disabled={disabled} onClick={onClick}>
          <Icon />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export default ActionButton;
