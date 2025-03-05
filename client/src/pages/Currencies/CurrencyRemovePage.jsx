import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
        onClick={handleRemoveCurrency}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ConfirmMessage>
      Ви впевнені, що хочете видалити валюту «{title}»?
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
      title='Видалення валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyRemovePage;
