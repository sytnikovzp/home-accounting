import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

function CurrencyRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currency,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const { title } = currency ?? {};

  const [removeCurrency, { isLoading: isRemoving, error: removeError }] =
    useRemoveCurrencyMutation();

  const error = fetchError || removeError;

  const handleRemoveCurrency = useCallback(async () => {
    const result = await removeCurrency(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCurrency]);

  const content = isFetching ? (
    <Preloader />
  ) : (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      Ви впевнені, що хочете видалити валюту «{title}»?
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
      title='Видалення валюти'
      onClose={handleModalClose}
      onSubmit={handleRemoveCurrency}
    />
  );
}

export default CurrencyRemovePage;
