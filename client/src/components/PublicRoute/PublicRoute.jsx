import { Navigate } from 'react-router-dom';

import useAuthentication from '../../hooks/useAuthentication';

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthentication();

  if (isAuthenticated) {
    return <Navigate replace to='/' />;
  }

  return children;
}

export default PublicRoute;
