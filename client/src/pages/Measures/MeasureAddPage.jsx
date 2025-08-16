import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddMeasureMutation } from '@/src/store/services';

import MeasureForm from '@/src/components/forms/MeasureForm';
import ModalWindow from '@/src/components/ModalWindow';

function MeasureAddPage({ handleModalClose }) {
  const [addMeasure, { isLoading: isSubmitting, error: submitError }] =
    useAddMeasureMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addMeasure(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addMeasure, handleModalClose]
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
    <ModalWindow isOpen title='Додавання одиниці' onClose={handleModalClose}>
      <MeasureForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default MeasureAddPage;
