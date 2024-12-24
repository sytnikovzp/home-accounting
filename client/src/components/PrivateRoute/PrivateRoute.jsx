import { useEffect } from 'react';

function PrivateRoute({ children, isAuthenticated, setAuthModalOpen }) {
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [isAuthenticated, setAuthModalOpen]);
  if (!isAuthenticated) {
    return null;
  }
  return children;
}

export default PrivateRoute;
