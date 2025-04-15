import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    const response = await removeMeasure(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeMeasure]);

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
            onClick={handleRemoveMeasure}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити одиницю вимірів «${measure?.title}»? Це
          призведе до видалення всіх витрат, де вона використовується.`}
      isFetching={isFetching}
      title='Видалення одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureRemovePage;
