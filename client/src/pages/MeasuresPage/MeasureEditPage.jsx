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
  const { id } = useParams();
  const {
    entity: measureToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Measure');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleSubmitMeasure = async (values) => {
    try {
      await restController.editMeasure(
        measureToCRUD.id,
        values.title,
        values.description
      );
      handleModalClose();
      fetchMeasures();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
      );
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
