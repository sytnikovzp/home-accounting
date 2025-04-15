import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: category,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const [removeCategory, { isLoading: isRemoving, error: removeError }] =
    useRemoveCategoryMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveCategory = useCallback(async () => {
    const response = await removeCategory(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCategory]);

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
      actionsOnRight={
        <>
          <Button color='default' variant='text' onClick={handleModalClose}>
            Скасувати
          </Button>
          <Button
            color='error'
            disabled={isRemoving || isFetching}
            variant='contained'
            onClick={handleRemoveCategory}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити категорію «${category?.title}»?`}
      isFetching={isFetching}
      title='Видалення категорії'
      onClose={handleModalClose}
    />
  );
}

export default CategoryRemovePage;
