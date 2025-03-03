import { useCallback } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import useHasPermission from '../../hooks/useHasPermission';

import ActionButton from './ActionButton';

function ActionColumns({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const { hasPermission } = useHasPermission();

  const handleEdit = useCallback(() => onEdit(row), [onEdit, row]);
  const handleRemove = useCallback(() => onRemove(row), [onRemove, row]);
  const handleModerate = useCallback(() => onModerate(row), [onModerate, row]);

  return (
    <>
      {hasPermission(linkEntity, 'edit') && (
        <ActionButton Icon={EditIcon} title='Редагувати' onClick={handleEdit} />
      )}

      {hasPermission(linkEntity, 'remove') && (
        <ActionButton
          Icon={DeleteIcon}
          title='Видалити'
          onClick={handleRemove}
        />
      )}

      {linkEntity === 'moderation' && (
        <ActionButton
          Icon={VerifiedUserIcon}
          title='Модерувати'
          onClick={handleModerate}
        />
      )}
    </>
  );
}

export default ActionColumns;
