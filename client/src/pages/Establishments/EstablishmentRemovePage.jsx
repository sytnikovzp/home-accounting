import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
    <ModalWindow isOpen title='Видалення закладу' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          Ви впевнені, що хочете видалити заклад «{establishment?.title}»? Це
          призведе до видалення всіх витрат, пов`язаних з цим закладом.
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
          onClick={handleRemoveEstablishment}
        >
          Видалити
        </Button>
      </ModalActions>
    </ModalWindow>
  );
}

export default EstablishmentRemovePage;
