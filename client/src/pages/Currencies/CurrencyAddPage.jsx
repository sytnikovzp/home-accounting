import { useCallback } from 'react';

import { useAddCurrencyMutation } from '../../store/services';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  const content = (
    <CurrencyForm isSubmitting={isSubmitting} onSubmit={handleSubmitCurrency} />
  );

  if (submitError) {
    return (
      <InfoModal
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      title='Додавання валюти'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyAddPage;
