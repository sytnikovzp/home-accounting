import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useChangeUserPhotoMutation,
  useEditUserMutation,
  useFetchUserByUuidQuery,
  useRemoveUserMutation,
  useResetUserPhotoMutation,
} from '../../store/services';

import UserForm from '../../components/Forms/UserForm/UserForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function UserEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: user, isLoading: isFetching } = useFetchUserByUuidQuery(uuid);

  const [editUser, { isLoading, error: editError }] = useEditUserMutation();

  const [changePhoto, { isLoading: isUploading, error: uploadError }] =
    useChangeUserPhotoMutation();
  const [resetPhoto, { isLoading: isResetting, error: resetError }] =
    useResetUserPhotoMutation();
  const [removeUser, { isLoading: isRemoving, error: removingError }] =
    useRemoveUserMutation();

  const isChanging = isUploading || isResetting;
  const error = uploadError || resetError || removingError || editError;

  const handleUploadPhoto = useCallback(
    async (file) => {
      await changePhoto({ userUuid: uuid, userPhoto: file });
    },
    [changePhoto, uuid]
  );

  const handleRemovePhoto = useCallback(async () => {
    await resetPhoto({ userUuid: uuid });
  }, [resetPhoto, uuid]);

  const handleDeleteProfile = useCallback(async () => {
    await removeUser(uuid);
  }, [removeUser, uuid]);

  const handleSubmitUser = useCallback(
    async (values) => {
      const result = await editUser({
        userUuid: uuid,
        ...values,
      });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editUser, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <UserForm
      isChanging={isChanging}
      isLoading={isLoading}
      isRemoving={isRemoving}
      user={user}
      onDelete={handleDeleteProfile}
      onReset={handleRemovePhoto}
      onSubmit={handleSubmitUser}
      onUpload={handleUploadPhoto}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserEditPage;
