import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';

function EstablishmentAddPage({
  handleModalClose,
  fetchEstablishments,
  crudError,
  setCrudError,
}) {
  const handleSubmitEstablishment = async (values) => {
    setCrudError(null);
    try {
      await restController.addEstablishment(
        values.title,
        values.description,
        values.url
      );
      handleModalClose();
      fetchEstablishments();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={<EstablishmentForm onSubmit={handleSubmitEstablishment} />}
      error={crudError}
      title='Додавання закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentAddPage;
