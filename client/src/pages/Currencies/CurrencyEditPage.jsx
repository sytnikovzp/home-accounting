import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useEditCurrencyMutation,
  useFetchCurrencyByUuidQuery,
} from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Редагування валюти' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <CurrencyForm
          currency={currency}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitCurrency}
        />
      )}
    </ModalWindow>
  );
}

export default CurrencyEditPage;
