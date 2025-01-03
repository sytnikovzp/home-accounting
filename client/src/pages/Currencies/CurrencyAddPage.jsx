import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';

function CurrencyAddPage({
  handleModalClose,
  fetchCurrencies,
  crudError,
  setCrudError,
}) {
  const handleSubmitCurrency = async (values) => {
    setCrudError(null);
    try {
      await restController.addCurrency(values.title, values.code);
      handleModalClose();
      fetchCurrencies();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання валюти...'
      content={<CurrencyForm onSubmit={handleSubmitCurrency} />}
      error={crudError}
    />
  );
}

export default CurrencyAddPage;
