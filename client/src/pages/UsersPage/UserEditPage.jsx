import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import UserForm from '../../components/Forms/UserForm/UserForm';

function UserEditPage({
  handleModalClose,
  fetchUsers,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: userToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('User');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitUser = async (values) => {
    setCrudError(null);
    try {
      await restController.editUser(
        userToCRUD.uuid,
        values.fullName,
        values.email,
        values.password,
        values.role
      );
      handleModalClose();
      fetchUsers();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    }
  };

  const handleUploadPhoto = async (file) => {
    setCrudError(null);
    try {
      await restController.uploadUserPhoto(userToCRUD.uuid, file);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження фотографії'
      );
    }
  };

  const handleRemovePhoto = async () => {
    setCrudError(null);
    try {
      await restController.removeUserPhoto(userToCRUD.uuid);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка видалення фотографії'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування користувача...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <UserForm
            user={userToCRUD}
            onSubmit={handleSubmitUser}
            onUploadPhoto={handleUploadPhoto}
            onRemovePhoto={handleRemovePhoto}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default UserEditPage;
