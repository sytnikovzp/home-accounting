import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function RoleEditPage({
  handleModalClose,
  fetchRoles,
  permissionsList,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: role,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Role');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitRole = async (values) => {
    setCrudError(null);
    try {
      await restController.editRole(
        role.uuid,
        values.title,
        values.description,
        values.permissions
      );
      handleModalClose();
      fetchRoles();
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
          <RoleForm
            permissionsList={permissionsList}
            role={role}
            onSubmit={handleSubmitRole}
          />
        )
      }
      error={error || crudError}
      title='Редагування ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleEditPage;
