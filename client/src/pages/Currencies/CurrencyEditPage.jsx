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

  const { data: currency, isLoading: isFetching } =
    useFetchCurrencyByUuidQuery(uuid);

  const [editCurrency, { isLoading, error }] = useEditCurrencyMutation();

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
      isLoading={isLoading}
      onSubmit={handleSubmitCurrency}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyEditPage;
