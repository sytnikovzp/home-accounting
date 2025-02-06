import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditMeasureMutation,
  useFetchMeasureByUuidQuery,
} from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function MeasureEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const [editMeasure, { isLoading: isSubmitting, error: submitError }] =
    useEditMeasureMutation();

  const error = fetchError || submitError;

  const handleSubmitMeasure = useCallback(
    async (values) => {
      const result = await editMeasure({ measureUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editMeasure, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <MeasureForm
      isSubmitting={isSubmitting}
      measure={measure}
      onSubmit={handleSubmitMeasure}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureEditPage;
