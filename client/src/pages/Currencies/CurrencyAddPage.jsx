import { useCallback, useMemo } from 'react';

import { useAddCurrencyMutation } from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyAddPage({ handleModalClose }) {
  const [addCurrency, { isLoading: isSubmitting, error: submitError }] =
    useAddCurrencyMutation();

  const handleSubmitCurrency = useCallback(
    async (values) => {
      const result = await addCurrency(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addCurrency, handleModalClose]
  );

  const content = useMemo(
    () => (
      <CurrencyForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitCurrency}
      />
    ),
    [handleSubmitCurrency, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyAddPage;
