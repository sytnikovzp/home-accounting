import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

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

  const content = isFetching ? (
    <Preloader />
  ) : (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      Ви впевнені, що хочете видалити одиницю вимірів «{title}»? Це призведе до
      видалення всіх витрат, де вона використовується.
    </Typography>
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
    <DeleteConfirmModal
      content={content}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      title='Видалення одиниці'
      onClose={handleModalClose}
      onSubmit={handleRemoveMeasure}
    />
  );
}

export default MeasureRemovePage;
