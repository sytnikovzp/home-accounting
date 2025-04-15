import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
      const response = await editCategory({ categoryUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editCategory, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування категорії'
      onClose={handleModalClose}
    >
      <CategoryForm
        category={category}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitCategory}
      />
    </ModalWindow>
  );
}

export default CategoryEditPage;
