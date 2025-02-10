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

  if (linkEntity === 'moderation') {
    const canModerate =
      hasPermission('MODERATION_ESTABLISHMENTS') ||
      hasPermission('MODERATION_PRODUCTS') ||
      hasPermission('MODERATION_CATEGORIES');

    return (
      <ActionButton
        disabled={!canModerate}
        Icon={TaskIcon}
        title='Модерувати'
        onClick={() => onModerate(row)}
      />
    );
  }

  const permission = ENTITY_PERMISSIONS[linkEntity];
  const canManage = permission ? hasPermission(permission) : true;

  return (
    <>
      <ActionButton
        disabled={!canManage}
        Icon={EditIcon}
        title='Редагувати'
        onClick={() => onEdit(row)}
      />
      <ActionButton
        disabled={!canManage}
        Icon={DeleteIcon}
        title='Видалити'
        onClick={() => onRemove(row)}
      />
    </>
  );
}

export default ActionBlock;
