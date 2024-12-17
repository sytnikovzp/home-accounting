import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import RoleForm from '../../components/Forms/RoleForm/RoleForm';

function RoleAddPage({
  handleModalClose,
  fetchRoles,
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
      title='Додавання ролі...'
      content={<RoleForm onSubmit={handleSubmitRole} />}
      error={crudError}
    />
  );
}

export default RoleAddPage;
