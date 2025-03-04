import { useCallback } from 'react';

import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { isLoading: isSubmitting, error: submitError }] =
    useAddCategoryMutation();

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await addCategory(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addCategory, handleModalClose]
  );

  const content = (
    <CategoryForm isSubmitting={isSubmitting} onSubmit={handleSubmitCategory} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання категорії'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
