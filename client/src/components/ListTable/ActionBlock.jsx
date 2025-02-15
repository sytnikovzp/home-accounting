import { useMemo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskIcon from '@mui/icons-material/Task';

import { entityPermissions } from '../../constants';
import useAuthUser from '../../hooks/useAuthUser';

import ActionButton from './ActionButton';

const { ENTITY_PERMISSIONS } = entityPermissions;

function ActionBlock({ row, linkEntity, onEdit, onRemove, onModerate }) {
  const { authenticatedUser } = useAuthUser();

  const hasPermission = useMemo(() => {
    if (!authenticatedUser?.permissions) {
      return () => false;
    }
    const permissionsSet = new Set(
      authenticatedUser.permissions.map((p) => p.title)
    );
    return (permission) => permissionsSet.has(permission);
  }, [authenticatedUser?.permissions]);

  const entityPerms = ENTITY_PERMISSIONS[linkEntity];

  if (!entityPerms) {
    return null;
  }

  const canEdit = hasPermission(entityPerms.edit);
  const canRemove = hasPermission(entityPerms.remove);
  const canModerate =
    linkEntity === 'moderation'
      ? entityPerms[row.path] && hasPermission(entityPerms[row.path])
      : entityPerms.moderate && hasPermission(entityPerms.moderate);

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
