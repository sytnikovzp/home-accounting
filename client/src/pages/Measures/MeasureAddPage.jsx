import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';

function MeasureAddPage({
  handleModalClose,
  fetchMeasures,
  crudError,
  setCrudError,
}) {
  const handleSubmitMeasure = async (values) => {
    setCrudError(null);
    try {
      await restController.addMeasure(values.title, values.description);
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
      title='Додавання одиниці...'
      content={<MeasureForm onSubmit={handleSubmitMeasure} />}
      error={crudError}
    />
  );
}

export default MeasureAddPage;
