import { useCallback, useMemo } from 'react';

import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import {
  stylesListTableActionsModeration,
  stylesListTableActionsNotModeration,
} from '../../styles';

function ActionButtons({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const handleAction = useCallback((action) => () => action(row), [row]);

  return useMemo(() => {
    if (linkEntity === 'moderation') {
      return (
        <TableCell align='center' sx={stylesListTableActionsModeration}>
          <Tooltip title='Модерувати'>
            <IconButton onClick={handleAction(onModerate)}>
              <TaskIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      );
    }

    return (
      <>
        <TableCell align='center' sx={stylesListTableActionsNotModeration}>
          <Tooltip title='Редагувати'>
            <IconButton onClick={handleAction(onEdit)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align='center' sx={stylesListTableActionsNotModeration}>
          <Tooltip title='Видалити'>
            <IconButton onClick={handleAction(onRemove)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </>
    );
  }, [linkEntity, onEdit, onRemove, onModerate, handleAction]);
}

export default ActionButtons;
