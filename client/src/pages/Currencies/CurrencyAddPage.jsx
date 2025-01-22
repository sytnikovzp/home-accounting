import restController from '../../api/rest/restController';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    <ModalWindow
      isOpen
      content={<CurrencyForm onSubmit={handleSubmitCurrency} />}
      error={crudError}
      title='Додавання валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyAddPage;
