import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessToken } from '../utils/sharedFunctions';
import { useFetchUserProfileQuery } from '../store/services';

import { logout } from '../store/slices/authUserSlice';

function useAuthUser() {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const { isLoading: isFetchingUser, isError } = useFetchUserProfileQuery(
    null,
    {
      skip: !accessToken,
    }
  );

  const authenticatedUser = useSelector(
    (state) => state.authUser.authenticatedUser
  );
  const isAuthenticated = useSelector(
    (state) => state.authUser.isAuthenticated
  );

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  return { isFetchingUser, authenticatedUser, isAuthenticated };
}

export default useAuthUser;
