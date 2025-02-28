import { useCallback, useMemo } from 'react';

import { useAddMeasureMutation } from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
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

  const content = useMemo(
    () => (
      <MeasureForm isSubmitting={isSubmitting} onSubmit={handleSubmitMeasure} />
    ),
    [handleSubmitMeasure, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Додавання одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureAddPage;
