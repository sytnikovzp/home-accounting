import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditMeasureMutation,
  useFetchMeasureByUuidQuery,
} from '@/src/store/services';

import MeasureForm from '@/src/components/_forms/MeasureForm/MeasureForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function MeasureEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measureData,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const [editMeasure, { isLoading: isSubmitting, error: submitError }] =
    useEditMeasureMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editMeasure({ measureUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editMeasure, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування одиниці'
      onClose={handleModalClose}
    >
      <MeasureForm
        isSubmitting={isSubmitting}
        measure={measureData}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default MeasureEditPage;
