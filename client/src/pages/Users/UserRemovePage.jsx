import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useLogoutMutation,
  useRemoveUserMutation,
  useRemoveUserProfileMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  const userData = useMemo(
    () => (isAuthenticatedUser ? authenticatedUser : user),
    [isAuthenticatedUser, authenticatedUser, user]
  );

  const { fullName } = userData ?? {};

  const [removeUser, { isLoading: isRemovingUser, error: removeUserError }] =
    useRemoveUserMutation();
  const [
    removeUserProfile,
    { isLoading: isRemovingUserProfile, error: removeUserErrorProfile },
  ] = useRemoveUserProfileMutation();
  const [logoutMutation] = useLogoutMutation();

  const isRemoving = isRemovingUser || isRemovingUserProfile;
  const error = fetchError || removeUserError || removeUserErrorProfile;

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
    const result = await action(payload);
    if (result?.data) {
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

  const actions = (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
      <Button color='default' variant='text' onClick={handleModalClose}>
        Скасувати
      </Button>
      <Button
        color='error'
        disabled={isRemoving || isFetching}
        type='submit'
        variant='contained'
        onClick={handleRemoveUser}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ConfirmMessage>
      {isAuthenticatedUser
        ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
        : `Ви впевнені, що хочете видалити користувача «${fullName}»?`}
    </ConfirmMessage>
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      title='Видалення користувача'
      onClose={handleModalClose}
    />
  );
}

export default UserRemovePage;
