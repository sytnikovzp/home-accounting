import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function MeasureRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const { title } = measure ?? {};

  const [removeMeasure, { isLoading: isRemoving, error: removeError }] =
    useRemoveMeasureMutation();

  const error = fetchError || removeError;

  const handleRemoveMeasure = useCallback(async () => {
    const result = await removeMeasure(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeMeasure]);

  const actions = (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
      <Button color='default' variant='text' onClick={handleModalClose}>
        Скасувати
      </Button>
      <Button
        color='error'
        disabled={isRemoving || isFetching}
        type='submit'
        variant='contained'
        onClick={handleRemoveMeasure}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ConfirmMessage>
      Ви впевнені, що хочете видалити одиницю вимірів «{title}»? Це призведе до
      видалення всіх витрат, де вона використовується.
    </ConfirmMessage>
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      title='Видалення одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureRemovePage;
