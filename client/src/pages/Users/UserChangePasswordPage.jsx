import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';

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
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Зміна паролю...'
      content={
        isLoading ? <Preloader /> : <ChangePasswordForm onSubmit={handleSubmitUser} />
      }
      error={errorMessage || crudError}
    />
  );
}

export default UserChangePasswordPage;
