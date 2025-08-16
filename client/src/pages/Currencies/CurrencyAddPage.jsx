import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddCurrencyMutation } from '@/src/store/services';

import CurrencyForm from '@/src/components/forms/CurrencyForm';
import ModalWindow from '@/src/components/ModalWindow';

function CurrencyAddPage({ handleModalClose }) {
  const [addCurrency, { isLoading: isSubmitting, error: submitError }] =
    useAddCurrencyMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addCurrency(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addCurrency, handleModalClose]
  );

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
    <ModalWindow isOpen title='Додавання валюти' onClose={handleModalClose}>
      <CurrencyForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default CurrencyAddPage;
