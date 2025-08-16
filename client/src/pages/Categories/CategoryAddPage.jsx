import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddCategoryMutation } from '@/src/store/services';

import CategoryForm from '@/src/components/forms/CategoryForm';
import ModalWindow from '@/src/components/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { isLoading: isSubmitting, error: submitError }] =
    useAddCategoryMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addCategory(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addCategory, handleModalClose]
  );

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Додавання категорії' onClose={handleModalClose}>
      <CategoryForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default CategoryAddPage;
