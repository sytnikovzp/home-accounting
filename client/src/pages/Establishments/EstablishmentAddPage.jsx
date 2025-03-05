import { useCallback } from 'react';

import { useAddEstablishmentMutation } from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function EstablishmentAddPage({ handleModalClose }) {
  const [addEstablishment, { isLoading: isSubmitting, error: submitError }] =
    useAddEstablishmentMutation();

  const handleSubmitEstablishment = useCallback(
    async (values) => {
      const result = await addEstablishment(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addEstablishment, handleModalClose]
  );

  const content = (
    <EstablishmentForm
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitEstablishment}
    />
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
      title='Додавання закладу'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentAddPage;
