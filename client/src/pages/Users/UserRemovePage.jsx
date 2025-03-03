import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchUserByUuidQuery,
  useLogoutMutation,
  useRemoveUserMutation,
  useRemoveUserProfileMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';

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

  if (error) {
    return (
      <InfoModal
        isOpen
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  const message = isAuthenticatedUser
    ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
    : `Ви впевнені, що хочете видалити користувача «${fullName}»?`;

  return (
    <DeleteConfirmModal
      isOpen
      isFetching={isFetching}
      isSubmitting={isRemovingUser || isRemovingUserProfile}
      message={message}
      title='Видалення користувача'
      onClose={handleModalClose}
      onSubmit={handleRemoveUser}
    />
  );
}

export default UserRemovePage;
