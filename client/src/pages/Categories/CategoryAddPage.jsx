import { useCallback } from 'react';

import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  if (submitError) {
    return (
      <InfoModal
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      title='Додавання категорії'
      onClose={handleModalClose}
    />
  );
}

export default CategoryAddPage;
