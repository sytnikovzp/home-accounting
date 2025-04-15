import { useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { isLoading: isSubmitting, error: submitError }] =
    useAddCategoryMutation();

  const error = submitError?.data;

  const handleSubmitCategory = useCallback(
    async (values) => {
      const response = await addCategory(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addCategory, handleModalClose]
  );

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Додавання категорії' onClose={handleModalClose}>
      <CategoryForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitCategory}
      />
    </ModalWindow>
  );
}

export default CategoryAddPage;
