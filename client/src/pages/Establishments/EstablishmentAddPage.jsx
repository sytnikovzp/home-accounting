import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddEstablishmentMutation } from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function EstablishmentAddPage({ handleModalClose }) {
  const [addEstablishment, { isLoading: isSubmitting, error: submitError }] =
    useAddEstablishmentMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addEstablishment(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addEstablishment, handleModalClose]
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
    <ModalWindow isOpen title='Додавання закладу' onClose={handleModalClose}>
      <EstablishmentForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default EstablishmentAddPage;
