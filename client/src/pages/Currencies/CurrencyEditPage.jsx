import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useEditCurrencyMutation,
  useFetchCurrencyByUuidQuery,
} from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currency,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const [editCurrency, { isLoading: isSubmitting, error: submitError }] =
    useEditCurrencyMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitCurrency = useCallback(
    async (values) => {
      const response = await editCurrency({ currencyUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editCurrency, handleModalClose, uuid]
  );

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
      isFetching={isFetching}
      title='Редагування валюти'
      onClose={handleModalClose}
    >
      <CurrencyForm
        currency={currency}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitCurrency}
      />
    </ModalWindow>
  );
}

export default CurrencyEditPage;
