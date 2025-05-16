import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessToken } from '../utils/authHelpers';

import { useFetchUserProfileQuery } from '../store/services';
import { clearAuthenticationState } from '../store/slices/authenticationSlice';

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
