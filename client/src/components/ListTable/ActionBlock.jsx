import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import useHasPermission from '../../hooks/useHasPermission';

import ActionButton from './ActionButton';

function ActionBlock({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const { hasPermission } = useHasPermission();

  return (
    <>
      {hasPermission(linkEntity, 'edit') && (
        <ActionButton
          Icon={EditIcon}
          title='Редагувати'
          onClick={() => onEdit(row)}
        />
      )}
      {hasPermission(linkEntity, 'remove') && (
        <ActionButton
          Icon={DeleteIcon}
          title='Видалити'
          onClick={() => onRemove(row)}
        />
      )}
      {linkEntity === 'moderation' && hasPermission(row.path, 'moderate') && (
        <ActionButton
          Icon={TaskIcon}
          title='Модерувати'
          onClick={() => onModerate(row)}
        />
      )}
    </>
  );
}

export default ActionBlock;
