import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button } from '@mui/material';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: category,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const [editCategory, { isLoading: isSubmitting, error: submitError }] =
    useEditCategoryMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await editCategory({ categoryUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editCategory, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      title='Редагування категорії'
      onClose={handleModalClose}
    >
      {isFetching ? (
        <Preloader />
      ) : (
        <CategoryForm
          category={category}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitCategory}
        />
      )}
    </ModalWindow>
  );
}

export default CategoryEditPage;
