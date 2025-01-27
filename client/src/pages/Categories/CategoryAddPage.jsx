import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { error }] = useAddCategoryMutation();

  const handleSubmitCategory = async (values) => {
    const result = await addCategory({ title: values.title });
    if (result?.data) {
      handleModalClose();
    }
  };

  return (
    <ModalWindow
      isOpen
      content={<CategoryForm onSubmit={handleSubmitCategory} />}
      error={error?.data}
      title='Додавання категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
