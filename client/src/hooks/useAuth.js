import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessToken } from '../utils/sharedFunctions';
import { useFetchUserProfileQuery } from '../store/services/userProfileApi';

import { logout } from '../store/slices/authSlice';

function useAuth() {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const { data, isSuccess, isError } = useFetchUserProfileQuery(null, {
    skip: !accessToken,
  });

  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  console.log('currentUser', currentUser);
  console.log('isAuthenticated', isAuthenticated);

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  return { currentUser, isAuthenticated };
}

export default useAuth;
