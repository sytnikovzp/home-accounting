import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow';

function CategoryRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: categoryData,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const [removeCategory, { isLoading: isRemoving, error: removeError }] =
    useRemoveCategoryMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити категорію «${categoryData?.title}»?`;

  const handleRemove = useCallback(async () => {
    const response = await removeCategory(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCategory]);

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
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення категорії'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default CategoryRemovePage;
