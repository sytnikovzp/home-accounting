import restController from '../../api/rest/restController';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    <ModalWindow
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
