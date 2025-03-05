import { useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
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
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
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
