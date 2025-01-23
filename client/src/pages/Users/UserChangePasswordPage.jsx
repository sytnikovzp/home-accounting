import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function UserChangePasswordPage({
  handleModalClose,
  fetchUsers,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: user,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('User');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitUser = async (values) => {
    setCrudError(null);
    try {
      await restController.changePassword(
        user.uuid,
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
    <ModalWindow
      isOpen
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ChangePasswordForm onSubmit={handleSubmitUser} />
        )
      }
      error={error || crudError}
      title='Зміна паролю...'
      onClose={handleModalClose}
    />
  );
}

export default UserChangePasswordPage;
