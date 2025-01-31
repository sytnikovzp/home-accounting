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

  const [editUser, { isLoading: isSubmitting, error: submitError }] =
    useEditUserMutation();
  const [changePhoto, { isLoading: isUploading, error: uploadError }] =
    useChangeUserPhotoMutation();
  const [resetPhoto, { isLoading: isResetting, error: resetError }] =
    useResetUserPhotoMutation();

  const isChanging = isUploading || isResetting;
  const error = uploadError || resetError || submitError;

  const handleUploadPhoto = useCallback(
    (file) => changePhoto({ userUuid: uuid, userPhoto: file }),
    [changePhoto, uuid]
  );

  const handleRemovePhoto = useCallback(
    () => resetPhoto(uuid),
    [resetPhoto, uuid]
  );

  const handleDeleteProfile = useCallback(() => {
    navigate(`/users/remove/${uuid}`);
  }, [navigate, uuid]);

  const handleSubmitUser = useCallback(
    async (values) => {
      const result = await editUser({ userUuid: uuid, ...values });
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
      isSubmitting={isSubmitting}
      user={user}
      onDelete={handleDeleteProfile}
      onRemove={handleRemovePhoto}
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
