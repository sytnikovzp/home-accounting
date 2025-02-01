import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function MeasureRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: measure, isLoading: isFetching } = useFetchMeasureByUuidQuery(
    uuid,
    { skip: !uuid }
  );

  const [removeMeasure, { isLoading: isRemoving, error: removeError }] =
    useRemoveMeasureMutation();

  const handleRemoveMeasure = useCallback(async () => {
    if (!measure?.uuid) {
      return;
    }
    const result = await removeMeasure(measure.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [measure?.uuid, handleModalClose, removeMeasure]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isFetching || isRemoving}
        size='large'
        variant='contained'
        onClick={handleRemoveMeasure}
      >
        Видалити
      </Button>,
    ],
    [isFetching, isRemoving, handleRemoveMeasure]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити одиницю вимірів «{measure?.title}»? Це
        призведе до видалення всіх витрат, де вона використовується.
      </Typography>
    );
  }, [isFetching, measure?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={removeError?.data}
      title='Видалення одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureRemovePage;
