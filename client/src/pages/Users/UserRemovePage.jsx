import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

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
    data: userData,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const user = isAuthenticatedUser ? authenticatedUser : userData;

  const [removeUser, { isLoading: isRemovingUser, error: removeUserError }] =
    useRemoveUserMutation();
  const [
    removeUserProfile,
    { isLoading: isRemovingUserProfile, error: removeUserErrorProfile },
  ] = useRemoveUserProfileMutation();
  const [logoutMutation] = useLogoutMutation();

  const isRemoving = isRemovingUser || isRemovingUserProfile;
  const apiError =
    fetchError?.data || removeUserError?.data || removeUserErrorProfile?.data;

  const confirmMessage = isAuthenticatedUser
    ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
    : `Ви впевнені, що хочете видалити користувача «${user?.fullName}»? Це призведе до видалення всіх витрат, 
    що пов'язані з цим користувачем.`;

  const handleModalClose = useCallback(() => {
    if (uuid) {
      navigate('/users');
    } else {
      navigate(-1);
    }
  }, [uuid, navigate]);

  const handleRemove = useCallback(async () => {
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

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення користувача'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default UserRemovePage;
