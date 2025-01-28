import { useCallback } from 'react';

import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { isLoading, error }] = useAddCategoryMutation();

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await addCategory({ title: values.title });
      if (result?.data) {
        handleModalClose();
      }
    },
    [addCategory, handleModalClose]
  );

  const content = (
    <CategoryForm isLoading={isLoading} onSubmit={handleSubmitCategory} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Додавання категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
