import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '../../store/selectors/authSelectors';

function PrivateRoute({ children, setAuthModalOpen }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [isAuthenticated, setAuthModalOpen]);
  if (!isAuthenticated) {
    return <Navigate replace to='/auth' />;
  }

  return children;
}

export default PrivateRoute;
