import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  roles,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const navigate = useNavigate();
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
        values.role
      );
      handleModalClose();
      fetchUsers();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
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

  const handleChangePassword = () => {
    navigate(`/users/password/${uuid}`);
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
            roles={roles}
            onUploadPhoto={handleUploadPhoto}
            onRemovePhoto={handleRemovePhoto}
            onChangePassword={handleChangePassword}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default UserEditPage;
