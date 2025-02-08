import { Navigate } from 'react-router-dom';

import useAuthUser from '../../hooks/useAuthUser';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthUser();

  return isAuthenticated ? children : <Navigate replace to='/auth' />;
}

export default PrivateRoute;
