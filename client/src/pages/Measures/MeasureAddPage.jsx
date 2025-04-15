import { useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useAddMeasureMutation } from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureAddPage({ handleModalClose }) {
  const [addMeasure, { isLoading: isSubmitting, error: submitError }] =
    useAddMeasureMutation();

  const error = submitError?.data;

  const handleSubmitMeasure = useCallback(
    async (values) => {
      const response = await addMeasure(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addMeasure, handleModalClose]
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
    <ModalWindow isOpen title='Додавання одиниці' onClose={handleModalClose}>
      <MeasureForm isSubmitting={isSubmitting} onSubmit={handleSubmitMeasure} />
    </ModalWindow>
  );
}

export default MeasureAddPage;
