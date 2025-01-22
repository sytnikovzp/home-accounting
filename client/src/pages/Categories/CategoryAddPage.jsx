import restController from '../../api/rest/restController';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({
  handleModalClose,
  fetchCategories,
  crudError,
  setCrudError,
}) {
  const handleSubmitCategory = async (values) => {
    setCrudError(null);
    try {
      await restController.addCategory(values.title);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      content={<CategoryForm onSubmit={handleSubmitCategory} />}
      error={crudError}
      title='Додавання категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
