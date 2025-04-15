import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useLogoutMutation,
  useRemoveUserMutation,
  useRemoveUserProfileMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function UserRemovePage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: user,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const userData = isAuthenticatedUser ? authenticatedUser : user;

  const [removeUser, { isLoading: isRemovingUser, error: removeUserError }] =
    useRemoveUserMutation();
  const [
    removeUserProfile,
    { isLoading: isRemovingUserProfile, error: removeUserErrorProfile },
  ] = useRemoveUserProfileMutation();
  const [logoutMutation] = useLogoutMutation();

  const isRemoving = isRemovingUser || isRemovingUserProfile;
  const error =
    fetchError?.data || removeUserError?.data || removeUserErrorProfile?.data;

  const handleModalClose = useCallback(() => {
    if (uuid) {
      navigate('/users');
    } else {
      navigate(-1);
    }
  }, [uuid, navigate]);

  const handleRemoveUser = useCallback(async () => {
    const action = isAuthenticatedUser ? removeUserProfile : removeUser;
    const payload = isAuthenticatedUser ? null : uuid;
    const response = await action(payload);
    if (response?.data) {
      if (isAuthenticatedUser) {
        await logoutMutation();
        navigate('/');
        return;
      }
      handleModalClose();
    }
  }, [
    isAuthenticatedUser,
    removeUserProfile,
    removeUser,
    uuid,
    logoutMutation,
    navigate,
    handleModalClose,
  ]);

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      actionsOnRight={
        <>
          <Button color='default' variant='text' onClick={handleModalClose}>
            Скасувати
          </Button>
          <Button
            color='error'
            disabled={isRemoving || isFetching}
            variant='contained'
            onClick={handleRemoveUser}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={
        isAuthenticatedUser
          ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
          : `Ви впевнені, що хочете видалити користувача «${userData?.fullName}»?`
      }
      isFetching={isFetching}
      title='Видалення користувача'
      onClose={handleModalClose}
    />
  );
}

export default UserRemovePage;
