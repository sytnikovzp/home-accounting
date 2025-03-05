import { useCallback } from 'react';

import { Alert, Box, Button } from '@mui/material';

import { useAddCategoryMutation } from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryAddPage({ handleModalClose }) {
  const [addCategory, { isLoading: isSubmitting, error: submitError }] =
    useAddCategoryMutation();

  const error = submitError?.data;

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await addCategory(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addCategory, handleModalClose]
  );

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
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
