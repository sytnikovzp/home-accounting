import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import RoleForm from '../../components/Forms/RoleForm/RoleForm';

function RoleAddPage({
  handleModalClose,
  fetchRoles,
  permissionsList,
  crudError,
  setCrudError,
}) {
  const handleSubmitRole = async (values) => {
    setCrudError(null);
    try {
      await restController.addRole(
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання ролі...'
      content={
        <RoleForm
          onSubmit={handleSubmitRole}
          permissionsList={permissionsList}
        />
      }
      error={crudError}
    />
  );
}

export default RoleAddPage;
