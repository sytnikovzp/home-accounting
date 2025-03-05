import { useCallback } from 'react';

import { useAddMeasureMutation } from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureAddPage({ handleModalClose }) {
  const [addMeasure, { isLoading: isSubmitting, error: submitError }] =
    useAddMeasureMutation();

  const handleSubmitMeasure = useCallback(
    async (values) => {
      const result = await addMeasure(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addMeasure, handleModalClose]
  );

  const content = (
    <MeasureForm isSubmitting={isSubmitting} onSubmit={handleSubmitMeasure} />
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
      title='Додавання одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureAddPage;
