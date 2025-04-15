import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currency,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const [removeCurrency, { isLoading: isRemoving, error: removeError }] =
    useRemoveCurrencyMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveCurrency = useCallback(async () => {
    const response = await removeCurrency(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCurrency]);

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
            onClick={handleRemoveCurrency}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити валюту «${currency?.title}»?`}
      isFetching={isFetching}
      title='Видалення валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyRemovePage;
