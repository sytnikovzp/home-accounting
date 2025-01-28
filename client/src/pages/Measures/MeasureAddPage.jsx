import { useCallback } from 'react';

import { useAddMeasureMutation } from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureAddPage({ handleModalClose }) {
  const [addMeasure, { isLoading, error }] = useAddMeasureMutation();

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
    <MeasureForm isLoading={isLoading} onSubmit={handleSubmitMeasure} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Додавання одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureAddPage;
