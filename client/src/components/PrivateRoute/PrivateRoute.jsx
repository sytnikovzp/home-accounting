import { Navigate } from 'react-router-dom';

import useAuthentication from '../../hooks/useAuthentication';
import useHasPermission from '../../hooks/useHasPermission';

function PrivateRoute({ children, requiredPermissions = [] }) {
  const { isAuthenticated } = useAuthentication();
  const { hasPermission } = useHasPermission();

  if (!isAuthenticated) {
    return <Navigate replace to='/auth' />;
  }

  const hasAnyPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some(({ entity, action }) =>
      hasPermission(entity, action)
    );

  if (!hasAnyPermission) {
    return <Navigate replace to='/forbidden' />;
  }

  return children;
}

export default PrivateRoute;
