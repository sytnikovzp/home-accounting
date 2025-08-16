import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessToken } from '@/src/utils/authHelpers';

import { useFetchUserProfileQuery } from '@/src/store/services';
import { clearAuthenticationState } from '@/src/store/slices/authenticationSlice';

function useAuthentication() {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const { isFetching, isError } = useFetchUserProfileQuery(null, {
    skip: !accessToken,
  });

  const authenticatedUser = useSelector(
    (state) => state.authentication.authenticatedUser
  );
  const isAuthenticated = useSelector(
    (state) => state.authentication.isAuthenticated
  );

  useEffect(() => {
    if (isError) {
      dispatch(clearAuthenticationState());
    }
  }, [isError, dispatch]);

  return { authenticatedUser, isAuthenticated, isFetching };
}

export default useAuthentication;
