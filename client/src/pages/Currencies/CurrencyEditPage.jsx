import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

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

  const content = isFetching ? (
    <Preloader />
  ) : (
    <CurrencyForm
      currency={currency}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitCurrency}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error}
      title='Редагування валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyEditPage;
