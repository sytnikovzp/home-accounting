import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';

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
    if (uuid) fetchEntityByUuid(uuid);
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування одиниці...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <MeasureForm measure={measureToCRUD} onSubmit={handleSubmitMeasure} />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default MeasureEditPage;
