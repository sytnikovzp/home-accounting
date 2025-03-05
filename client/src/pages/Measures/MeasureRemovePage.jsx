import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button } from '@mui/material';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function MeasureRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const [removeMeasure, { isLoading: isRemoving, error: removeError }] =
    useRemoveMeasureMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveMeasure = useCallback(async () => {
    const result = await removeMeasure(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeMeasure]);

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
    <ModalWindow isOpen title='Видалення одиниці' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          Ви впевнені, що хочете видалити одиницю вимірів «{measure?.title}»? Це
          призведе до видалення всіх витрат, де вона використовується.
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
          onClick={handleRemoveMeasure}
        >
          Видалити
        </Button>
      </ModalActions>
    </ModalWindow>
  );
}

export default MeasureRemovePage;
