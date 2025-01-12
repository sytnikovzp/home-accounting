import restController from '../../api/rest/restController';

import MeasureForm from '../../components/Forms/MeasureForm/MeasureForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    <ModalWindow
      isOpen
      showCloseButton
      content={<MeasureForm onSubmit={handleSubmitMeasure} />}
      error={crudError}
      title='Додавання одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureAddPage;
