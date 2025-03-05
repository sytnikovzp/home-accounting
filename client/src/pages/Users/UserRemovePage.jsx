import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useLogoutMutation,
  useRemoveUserMutation,
  useRemoveUserProfileMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      title='Видалення користувача'
      onClose={handleModalClose}
    >
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          {isAuthenticatedUser
            ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
            : `Ви впевнені, що хочете видалити користувача «${userData?.fullName}»?`}
        </ConfirmMessage>
      )}
      <ModalActions>
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
      </ModalActions>
    </ModalWindow>
  );
}

export default UserRemovePage;
