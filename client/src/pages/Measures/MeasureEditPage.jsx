import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useEditMeasureMutation,
  useFetchMeasureByUuidQuery,
} from '../../store/services';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function MeasureEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const [editMeasure, { isLoading: isSubmitting, error: submitError }] =
    useEditMeasureMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitMeasure = useCallback(
    async (values) => {
      const response = await editMeasure({ measureUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editMeasure, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування одиниці'
      onClose={handleModalClose}
    >
      <MeasureForm
        isSubmitting={isSubmitting}
        measure={measure}
        onSubmit={handleSubmitMeasure}
      />
    </ModalWindow>
  );
}

export default MeasureEditPage;
