import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measureData,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const [removeMeasure, { isLoading: isRemoving, error: removeError }] =
    useRemoveMeasureMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити одиницю вимірів «${measureData?.title}»? Це
          призведе до видалення всіх витрат, де вона використовується.`;

  const handleRemove = useCallback(async () => {
    const response = await removeMeasure(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeMeasure]);

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
      title='Видалення одиниці'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default MeasureRemovePage;
