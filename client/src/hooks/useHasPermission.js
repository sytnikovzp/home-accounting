import { useMemo } from 'react';

import { ENTITY_PERMISSIONS } from '@/src/constants';
import useAuthentication from '@/src/hooks/useAuthentication';

function useHasPermission() {
  const { authenticatedUser } = useAuthentication();

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
