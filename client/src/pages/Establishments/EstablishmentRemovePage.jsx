import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function EstablishmentRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishment,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const [removeEstablishment, { isLoading: isRemoving, error: removeError }] =
    useRemoveEstablishmentMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveEstablishment = useCallback(async () => {
    const response = await removeEstablishment(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeEstablishment]);

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
            onClick={handleRemoveEstablishment}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити заклад «${establishment?.title}»? Це
          призведе до видалення всіх витрат, пов'язаних з цим закладом.`}
      isFetching={isFetching}
      title='Видалення закладу'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentRemovePage;
