import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  useFetchMeasureByUuidQuery,
  useRemoveMeasureMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
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

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveMeasure = useCallback(async () => {
    const result = await removeMeasure(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeMeasure]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveMeasure}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveMeasure]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesRedlineTypography} variant='body1'>
        Ви впевнені, що хочете видалити одиницю вимірів «{title}»? Це призведе
        до видалення всіх витрат, де вона використовується.
      </Typography>
    );
  }, [isFetching, title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureRemovePage;
