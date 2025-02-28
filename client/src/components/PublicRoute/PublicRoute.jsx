import { Navigate } from 'react-router-dom';

import useAuthUser from '../../hooks/useAuthUser';

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthUser();

  if (isAuthenticated) {
    return <Navigate replace to='/' />;
  }

  return children;
}

export default PublicRoute;
