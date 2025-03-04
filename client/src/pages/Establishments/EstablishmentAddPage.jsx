import { useCallback } from 'react';

import { useAddEstablishmentMutation } from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
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

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання закладу'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentAddPage;
