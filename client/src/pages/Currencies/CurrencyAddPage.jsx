import { useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useAddCurrencyMutation } from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyAddPage({ handleModalClose }) {
  const [addCurrency, { isLoading: isSubmitting, error: submitError }] =
    useAddCurrencyMutation();

  const error = submitError?.data;

  const handleSubmitCurrency = useCallback(
    async (values) => {
      const response = await addCurrency(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addCurrency, handleModalClose]
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
    <ModalWindow isOpen title='Додавання валюти' onClose={handleModalClose}>
      <CurrencyForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitCurrency}
      />
    </ModalWindow>
  );
}

export default CurrencyAddPage;
