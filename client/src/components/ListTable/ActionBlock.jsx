import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import useHasPermission from '../../hooks/useHasPermission';

import ActionButton from './ActionButton';

function ActionBlock({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const { hasPermission } = useHasPermission();

  const canEdit = hasPermission(linkEntity, 'edit');
  const canRemove = hasPermission(linkEntity, 'remove');
  const canModerate =
    linkEntity === 'moderation'
      ? hasPermission(row.path, 'moderate')
      : hasPermission(linkEntity, 'moderate');

  return (
    <>
      {linkEntity === 'moderation' ? (
        <ActionButton
          disabled={!canModerate}
          Icon={TaskIcon}
          title='Модерувати'
          onClick={() => onModerate(row)}
        />
      ) : (
        <>
          <ActionButton
            disabled={!canEdit}
            Icon={EditIcon}
            title='Редагувати'
            onClick={() => onEdit(row)}
          />
          <ActionButton
            disabled={!canRemove}
            Icon={DeleteIcon}
            title='Видалити'
            onClick={() => onRemove(row)}
          />
        </>
      )}
    </>
  );
}

export default ActionBlock;
