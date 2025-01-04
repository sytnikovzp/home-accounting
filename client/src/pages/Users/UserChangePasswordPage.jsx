import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import Preloader from '../../components/Preloader/Preloader';

function UserChangePasswordPage({
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
      await restController.changePassword(
        userToCRUD.uuid,
        values.newPassword,
        values.confirmNewPassword
      );
      handleModalClose();
      fetchUsers();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ChangePasswordForm onSubmit={handleSubmitUser} />
        )
      }
      error={errorMessage || crudError}
      title='Зміна паролю...'
      onClose={handleModalClose}
    />
  );
}

export default UserChangePasswordPage;
