import { Navigate } from 'react-router-dom';

import useAuthUser from '../../hooks/useAuthUser';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthUser();

  if (!isAuthenticated) {
    return <Navigate replace to='/auth' />;
  }

  return children;
}

export default PrivateRoute;
