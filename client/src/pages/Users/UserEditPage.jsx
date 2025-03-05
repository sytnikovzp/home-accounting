import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useChangeUserPhotoMutation,
  useChangeUserProfilePhotoMutation,
  useEditUserMutation,
  useEditUserProfileMutation,
  useFetchUserByUuidQuery,
  useResetUserPhotoMutation,
  useResetUserProfilePhotoMutation,
  usersApi,
} from '../../store/services';

import UserForm from '../../components/Forms/UserForm/UserForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function UserEditPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: user,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, {
    skip: isAuthenticatedUser,
  });

  const userData = isAuthenticatedUser ? authenticatedUser : user;

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
  const error =
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

  const handleRemoveProfile = useCallback(() => {
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

  const handleSubmitUser = useCallback(
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
      title='Редагування користувача'
      onClose={handleModalClose}
    >
      {isFetching ? (
        <Preloader />
      ) : (
        <UserForm
          isChanging={isChangingPhoto}
          isSubmitting={isUserSubmitting || isUserProfileSubmitting}
          user={userData}
          onPassword={handleChangePassword}
          onRemove={handleRemoveProfile}
          onReset={handleResetPhoto}
          onSubmit={handleSubmitUser}
          onUpload={handleUploadPhoto}
        />
      )}
    </ModalWindow>
  );
}

export default UserEditPage;
