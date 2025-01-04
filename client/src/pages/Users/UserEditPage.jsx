import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import UserForm from '../../components/Forms/UserForm/UserForm';
import Preloader from '../../components/Preloader/Preloader';

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
      setCrudError(error.response.data);
    }
  };

  const handleUploadPhoto = async (file) => {
    setCrudError(null);
    try {
      await restController.uploadUserPhoto(userToCRUD.uuid, file);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleRemovePhoto = async () => {
    setCrudError(null);
    try {
      await restController.removeUserPhoto(userToCRUD.uuid);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleChangePassword = () => {
    navigate(`/users/password/${uuid}`);
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <UserForm
            roles={roles}
            user={userToCRUD}
            onChangePassword={handleChangePassword}
            onRemovePhoto={handleRemovePhoto}
            onSubmit={handleSubmitUser}
            onUploadPhoto={handleUploadPhoto}
          />
        )
      }
      error={errorMessage || crudError}
      title='Редагування користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserEditPage;
