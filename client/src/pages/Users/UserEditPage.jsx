import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Alert from '@mui/material/Alert';

import useAuthentication from '@/src/hooks/useAuthentication';

import {
  useChangeUserPhotoMutation,
  useChangeUserProfilePhotoMutation,
  useEditUserMutation,
  useEditUserProfileMutation,
  useFetchUserByUuidQuery,
  useResetUserPhotoMutation,
  useResetUserProfilePhotoMutation,
  usersApi,
} from '@/src/store/services';

import UserForm from '@/src/components/forms/UserForm';
import ModalWindow from '@/src/components/ModalWindow';

function UserEditPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthentication();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: userData,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, {
    skip: isAuthenticatedUser,
  });

  const user = isAuthenticatedUser ? authenticatedUser : userData;

  const [
    editUser,
    {
      isLoading: isUserSubmitting,
      error: submitUserError,
      reset: resetUserSubmitting,
    },
  ] = useEditUserMutation();
  const [
    editUserProfile,
    {
      isLoading: isUserProfileSubmitting,
      error: submitUserProfileError,
      reset: resetUserProfileSubmitting,
    },
  ] = useEditUserProfileMutation();

  const [
    changeUserPhoto,
    {
      isLoading: isUserPhotoUploading,
      error: uploadUserPhotoError,
      reset: resetUserPhotoUploading,
    },
  ] = useChangeUserPhotoMutation();
  const [
    changeUserProfilePhoto,
    {
      isLoading: isUserProfilePhotoUploading,
      error: uploadUserProfilePhotoError,
      reset: resetUserProfilePhotoUploading,
    },
  ] = useChangeUserProfilePhotoMutation();

  const [
    resetUserPhoto,
    {
      isLoading: isUserPhotoResetting,
      error: resetUserPhotoError,
      reset: resetUserPhotoResetting,
    },
  ] = useResetUserPhotoMutation();
  const [
    resetUserProfilePhoto,
    {
      isLoading: isUserProfilePhotoResetting,
      error: resetUserProfilePhotoError,
      reset: resetUserProfilePhotoResetting,
    },
  ] = useResetUserProfilePhotoMutation();

  const isChangingPhoto =
    isUserPhotoUploading ||
    isUserProfilePhotoUploading ||
    isUserPhotoResetting ||
    isUserProfilePhotoResetting;
  const apiError =
    fetchError?.data ||
    submitUserError?.data ||
    submitUserProfileError?.data ||
    uploadUserPhotoError?.data ||
    uploadUserProfilePhotoError?.data ||
    resetUserPhotoError?.data ||
    resetUserProfilePhotoError?.data;

  const handleUploadPhoto = useCallback(
    async (file) => {
      resetUserSubmitting();
      resetUserProfileSubmitting();
      resetUserPhotoResetting();
      resetUserProfilePhotoResetting();
      const action = isAuthenticatedUser
        ? changeUserProfilePhoto
        : changeUserPhoto;
      const payload = isAuthenticatedUser
        ? { userUuid: uuid, userPhoto: file }
        : { userPhoto: file };
      await action(payload);
      dispatch(usersApi.util.invalidateTags([{ type: 'User', id: 'LIST' }]));
    },
    [
      resetUserSubmitting,
      resetUserProfileSubmitting,
      resetUserPhotoResetting,
      resetUserProfilePhotoResetting,
      isAuthenticatedUser,
      changeUserProfilePhoto,
      changeUserPhoto,
      uuid,
      dispatch,
    ]
  );

  const handleResetPhoto = useCallback(async () => {
    resetUserSubmitting();
    resetUserProfileSubmitting();
    resetUserPhotoUploading();
    resetUserProfilePhotoUploading();
    const action = isAuthenticatedUser ? resetUserProfilePhoto : resetUserPhoto;
    const payload = isAuthenticatedUser ? null : uuid;
    await action(payload);
    dispatch(usersApi.util.invalidateTags([{ type: 'User', id: 'LIST' }]));
  }, [
    resetUserSubmitting,
    resetUserProfileSubmitting,
    resetUserPhotoUploading,
    resetUserProfilePhotoUploading,
    isAuthenticatedUser,
    resetUserProfilePhoto,
    resetUserPhoto,
    uuid,
    dispatch,
  ]);

  const handleRemove = useCallback(() => {
    if (isAuthenticatedUser) {
      navigate(`/remove-profile`);
    } else {
      navigate(`/users/remove/${uuid}`);
    }
  }, [isAuthenticatedUser, navigate, uuid]);

  const handleChangePassword = useCallback(() => {
    if (isAuthenticatedUser) {
      navigate(`/password`);
    } else {
      navigate(`/users/password/${uuid}`);
    }
  }, [isAuthenticatedUser, navigate, uuid]);

  const handleModalClose = useCallback(() => {
    if (uuid) {
      navigate('/users');
    } else {
      navigate(-1);
    }
  }, [uuid, navigate]);

  const handleSubmit = useCallback(
    async (values) => {
      resetUserPhotoUploading();
      resetUserPhotoResetting();
      const action = isAuthenticatedUser ? editUserProfile : editUser;
      const payload = isAuthenticatedUser
        ? values
        : { userUuid: uuid, ...values };
      const response = await action(payload);
      if (response?.data) {
        dispatch(usersApi.util.invalidateTags([{ type: 'User', id: 'LIST' }]));
        handleModalClose();
      }
    },
    [
      resetUserPhotoUploading,
      resetUserPhotoResetting,
      isAuthenticatedUser,
      editUserProfile,
      editUser,
      uuid,
      dispatch,
      handleModalClose,
    ]
  );

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
      isFetching={isFetching}
      title='Редагування користувача'
      onClose={handleModalClose}
    >
      <UserForm
        isChanging={isChangingPhoto}
        isSubmitting={isUserSubmitting || isUserProfileSubmitting}
        user={user}
        onPassword={handleChangePassword}
        onRemove={handleRemove}
        onReset={handleResetPhoto}
        onSubmit={handleSubmit}
        onUpload={handleUploadPhoto}
      />
    </ModalWindow>
  );
}

export default UserEditPage;
