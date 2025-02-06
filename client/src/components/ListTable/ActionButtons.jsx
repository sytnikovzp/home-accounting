import { IconButton, TableCell, Tooltip } from '@mui/material';
import { Delete, Edit, Task } from '@mui/icons-material';

import { stylesListTableActionsBodyTableCell } from '../../styles';

function ActionButtons({ row, linkEntity, onEdit, onRemove, onModerate }) {
  return (
    <TableCell align='center' sx={stylesListTableActionsBodyTableCell}>
      {linkEntity === 'moderation' ? (
        <Tooltip title='Модерувати'>
          <IconButton onClick={() => onModerate(row)}>
            <Task />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title='Редагувати'>
            <IconButton onClick={() => onEdit(row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title='Видалити'>
            <IconButton onClick={() => onRemove(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      )}
    </TableCell>
  );
}

export default ActionButtons;
