import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: categoryData,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const [editCategory, { isLoading: isSubmitting, error: submitError }] =
    useEditCategoryMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editCategory({ categoryUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editCategory, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування категорії'
      onClose={handleModalClose}
    >
      <CategoryForm
        category={categoryData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default CategoryEditPage;
