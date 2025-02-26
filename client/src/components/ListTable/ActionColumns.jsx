import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import useHasPermission from '../../hooks/useHasPermission';

import ActionButton from './ActionButton';

function ActionColumns({ row, linkEntity, onEdit, onRemove, onModerate }) {
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
      {linkEntity === 'moderation' && (
        <ActionButton
          Icon={VerifiedUserIcon}
          title='Модерувати'
          onClick={() => onModerate(row)}
        />
      )}
    </>
  );
}

export default ActionColumns;
