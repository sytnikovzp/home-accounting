import restController from '../../api/rest/restController';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    <ModalWindow
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
