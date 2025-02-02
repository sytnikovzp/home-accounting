import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useChangeUserPhotoMutation,
  useEditUserMutation,
  useFetchUserByUuidQuery,
  useResetUserPhotoMutation,
} from '../../store/services';

import UserForm from '../../components/Forms/UserForm/UserForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function UserEditPage({ handleModalClose }) {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: isFetching } = useFetchUserByUuidQuery(uuid, {
    skip: !uuid,
  });

  const [
    editUser,
    { isLoading: isSubmitting, error: submitError, reset: resetSubmitting },
  ] = useEditUserMutation();
  const [
    changePhoto,
    { isLoading: isUploading, error: uploadError, reset: resetUploading },
  ] = useChangeUserPhotoMutation();
  const [
    resetPhoto,
    { isLoading: isResetting, error: resetError, reset: resetResetting },
  ] = useResetUserPhotoMutation();

  const isChanging = isUploading || isResetting;
  const error = uploadError || resetError || submitError;

  const handleUploadPhoto = useCallback(
    async (file) => {
      resetSubmitting();
      resetResetting();
      await changePhoto({ userUuid: uuid, userPhoto: file });
    },
    [changePhoto, resetResetting, resetSubmitting, uuid]
  );

  const handleResetPhoto = useCallback(async () => {
    resetSubmitting();
    resetUploading();
    await resetPhoto(uuid);
  }, [resetPhoto, resetSubmitting, resetUploading, uuid]);

  const handleRemoveProfile = useCallback(() => {
    navigate(`/users/remove/${uuid}`);
  }, [navigate, uuid]);

  const handleSubmitUser = useCallback(
    async (values) => {
      resetUploading();
      resetResetting();
      const result = await editUser({ userUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editUser, handleModalClose, resetResetting, resetUploading, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <UserForm
      isChanging={isChanging}
      isSubmitting={isSubmitting}
      user={user}
      onRemove={handleRemoveProfile}
      onReset={handleResetPhoto}
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
