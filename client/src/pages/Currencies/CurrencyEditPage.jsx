import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditCurrencyMutation,
  useFetchCurrencyByUuidQuery,
} from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  const error = fetchError || submitError;

  const handleSubmitCurrency = useCallback(
    async (values) => {
      const result = await editCurrency({ currencyUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editCurrency, handleModalClose, uuid]
  );

  const content = (
    <CurrencyForm
      currency={currency}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitCurrency}
    />
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
      content={content}
      isFetching={isFetching}
      title='Редагування валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyEditPage;
