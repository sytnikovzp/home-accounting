import { useCallback } from 'react';

import { useAddCurrencyMutation } from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyAddPage({ handleModalClose }) {
  const [addCurrency, { isLoading, error }] = useAddCurrencyMutation();

  const handleSubmitCurrency = useCallback(
    async (values) => {
      const result = await addCurrency({
        title: values.title,
        code: values.code,
      });
      if (result?.data) {
        handleModalClose();
      }
    },
    [addCurrency, handleModalClose]
  );

  const content = (
    <CurrencyForm isLoading={isLoading} onSubmit={handleSubmitCurrency} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Додавання валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyAddPage;
