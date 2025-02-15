import { useMemo } from 'react';

import { entityPermissions } from '../constants';

import useAuthUser from './useAuthUser';

const { ENTITY_PERMISSIONS } = entityPermissions;

function useHasPermission() {
  const { authenticatedUser } = useAuthUser();

  const hasPermission = useMemo(() => {
    if (!authenticatedUser?.permissions) {
      return () => false;
    }

    const permissionsSet = new Set(
      authenticatedUser.permissions.map((p) => p.title)
    );

    return (entity, action) => {
      const permission = ENTITY_PERMISSIONS[entity]?.[action];
      return permission ? permissionsSet.has(permission) : false;
    };
  }, [authenticatedUser?.permissions]);

  return { hasPermission, ENTITY_PERMISSIONS };
}

export default useHasPermission;
