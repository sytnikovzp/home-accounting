import { useCallback, useMemo } from 'react';

import { ENTITY_PERMISSIONS } from '@/src/constants';
import useAuthentication from '@/src/hooks/useAuthentication';

function useHasPermission() {
  const { authenticatedUser } = useAuthentication();

  const permissions = authenticatedUser?.permissions ?? null;

  const permissionsSet = useMemo(() => {
    if (!permissions) {
      return null;
    }
    return new Set(permissions.map((p) => p.title));
  }, [permissions]);

  const hasPermission = useCallback(
    (entity, action) => {
      if (!permissionsSet) {
        return false;
      }
      const permission = ENTITY_PERMISSIONS[entity]?.[action];
      return permission ? permissionsSet.has(permission) : false;
    },
    [permissionsSet]
  );

  return { hasPermission, ENTITY_PERMISSIONS };
}

export default useHasPermission;
