import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function MeasureEditPage({
  handleModalClose,
  fetchMeasures,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: measureToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Measure');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitMeasure = async (values) => {
    setCrudError(null);
    try {
      await restController.editMeasure(
        measureToCRUD.uuid,
        values.title,
        values.description
      );
      handleModalClose();
      fetchMeasures();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <MeasureForm measure={measureToCRUD} onSubmit={handleSubmitMeasure} />
        )
      }
      error={errorMessage || crudError}
      title='Редагування одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureEditPage;
