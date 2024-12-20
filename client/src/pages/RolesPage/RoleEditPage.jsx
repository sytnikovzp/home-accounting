import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import RoleForm from '../../components/Forms/RoleForm/RoleForm';

function RoleEditPage({
  handleModalClose,
  fetchRoles,
  permissionsList,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: roleToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Role');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitRole = async (values) => {
    setCrudError(null);
    try {
      await restController.editRole(
        roleToCRUD.uuid,
        values.title,
        values.description,
        values.permissions
      );
      handleModalClose();
      fetchRoles();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування ролі...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <RoleForm
            role={roleToCRUD}
            onSubmit={handleSubmitRole}
            permissionsList={permissionsList}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default RoleEditPage;
