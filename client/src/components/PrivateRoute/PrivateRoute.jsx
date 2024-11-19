import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated, setAuthModalOpen }) => {
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [isAuthenticated, setAuthModalOpen]);
  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />;
  }
  return children;
};

export default PrivateRoute;
