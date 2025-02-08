import { useCallback, useMemo } from 'react';

import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import { stylesListTableActionsBodyTableCell } from '../../styles';

function ActionButtons({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const handleEdit = useCallback(() => onEdit(row), [onEdit, row]);
  const handleRemove = useCallback(() => onRemove(row), [onRemove, row]);
  const handleModerate = useCallback(() => onModerate(row), [onModerate, row]);

  const actions = useMemo(() => {
    if (linkEntity === 'moderation') {
      return [
        {
          title: 'Модерувати',
          icon: <TaskIcon />,
          onClick: handleModerate,
        },
      ];
    }
    return [
      {
        title: 'Редагувати',
        icon: <EditIcon />,
        onClick: handleEdit,
      },
      {
        title: 'Видалити',
        icon: <DeleteIcon />,
        onClick: handleRemove,
      },
    ];
  }, [linkEntity, handleEdit, handleRemove, handleModerate]);

  return (
    <TableCell align='center' sx={stylesListTableActionsBodyTableCell}>
      {actions.map(({ title, icon, onClick }) => (
        <Tooltip key={title} title={title}>
          <IconButton onClick={onClick}>{icon}</IconButton>
        </Tooltip>
      ))}
    </TableCell>
  );
}
export default ActionButtons;
