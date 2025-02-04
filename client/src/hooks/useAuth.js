import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAccessToken } from '../utils/sharedFunctions';
import { useFetchUserProfileQuery, useLogoutMutation } from '../store/services';

export const useAuth = () => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  const { data, isSuccess } = useFetchUserProfileQuery(null, {
    skip: !accessToken,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setIsAuthenticated(true);
      setCurrentUser(data);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [isSuccess, data]);

  const logout = useCallback(async () => {
    await logoutMutation();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  }, [logoutMutation, navigate]);

  return {
    currentUser,
    isAuthenticated,
    logout,
  };
};
