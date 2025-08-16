import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditCurrencyMutation,
  useFetchCurrencyByUuidQuery,
} from '@/src/store/services';

import CurrencyForm from '@/src/components/_forms/CurrencyForm/CurrencyForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function CurrencyEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currencyData,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const [editCurrency, { isLoading: isSubmitting, error: submitError }] =
    useEditCurrencyMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editCurrency({ currencyUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editCurrency, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування валюти'
      onClose={handleModalClose}
    >
      <CurrencyForm
        currency={currencyData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default CurrencyEditPage;
