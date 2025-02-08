import { IconButton, TableCell, Tooltip } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import { stylesListTableActionsBodyTableCell } from '../../styles';

function ActionButtons({ row, linkEntity, onEdit, onRemove, onModerate }) {
  return (
    <TableCell align='center' sx={stylesListTableActionsBodyTableCell}>
      {linkEntity === 'moderation' ? (
        <Tooltip title='Модерувати'>
          <IconButton onClick={() => onModerate(row)}>
            <TaskIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title='Редагувати'>
            <IconButton onClick={() => onEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Видалити'>
            <IconButton onClick={() => onRemove(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </TableCell>
  );
}

export default ActionButtons;
