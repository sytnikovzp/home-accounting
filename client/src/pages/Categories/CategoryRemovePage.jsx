import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
    <ModalWindow isOpen title='Видалення категорії' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          Ви впевнені, що хочете видалити категорію «{category?.title}»?
        </ConfirmMessage>
      )}
      <ModalActions>
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
      </ModalActions>
    </ModalWindow>
  );
}

export default CategoryRemovePage;
