import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoryAddPage({ handleModalClose, crudError, setCrudError }) {
  const handleSubmitCategory = async (values) => {
    setCrudError(null);
    try {
      await restController.addCategory(values.title);
      handleModalClose();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={<CategoryForm onSubmit={handleSubmitCategory} />}
      error={crudError}
      title='Додавання категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
