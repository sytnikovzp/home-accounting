import { useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useAddEstablishmentMutation } from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function EstablishmentAddPage({ handleModalClose }) {
  const [addEstablishment, { isLoading: isSubmitting, error: submitError }] =
    useAddEstablishmentMutation();

  const error = submitError?.data;

  const handleSubmitEstablishment = useCallback(
    async (values) => {
      const response = await addEstablishment(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addEstablishment, handleModalClose]
  );

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Додавання закладу' onClose={handleModalClose}>
      <EstablishmentForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitEstablishment}
      />
    </ModalWindow>
  );
}

export default EstablishmentAddPage;
