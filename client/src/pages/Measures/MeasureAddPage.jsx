import { useCallback } from 'react';

import { Alert, Box, Button } from '@mui/material';

import { useAddMeasureMutation } from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureAddPage({ handleModalClose }) {
  const [addMeasure, { isLoading: isSubmitting, error: submitError }] =
    useAddMeasureMutation();

  const error = submitError?.data;

  const handleSubmitMeasure = useCallback(
    async (values) => {
      const result = await addMeasure(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addMeasure, handleModalClose]
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
    <ModalWindow isOpen title='Додавання одиниці' onClose={handleModalClose}>
      <MeasureForm isSubmitting={isSubmitting} onSubmit={handleSubmitMeasure} />
    </ModalWindow>
  );
}

export default MeasureAddPage;
