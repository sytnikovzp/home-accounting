import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@mui/material';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  const handleRemoveCategory = useCallback(async () => {
    await removeCategory(uuid).unwrap();
    handleModalClose();
  }, [uuid, handleModalClose, removeCategory]);

  if (fetchError || removeError) {
    return (
      <InfoModal
        message={fetchError?.data?.message || removeError?.data?.message}
        severity={fetchError?.data?.severity || removeError?.data?.severity}
        title={fetchError?.data?.title || removeError?.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow isOpen title='Видалити категорію' onClose={handleModalClose}>
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
