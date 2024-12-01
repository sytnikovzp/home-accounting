import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoryAddPage({
  handleModalClose,
  fetchCategories,
  crudError,
  setCrudError,
}) {
  const handleSubmitCategory = async (values) => {
    try {
      await restController.addCategory(values.title);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response?.data?.errors?.[0]?.title);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання категорії...'
      content={<CategoryForm onSubmit={handleSubmitCategory} />}
      error={crudError}
    />
  );
}

export default CategoryAddPage;
