import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';

function CurrencyEditPage({
  handleModalClose,
  fetchCurrencies,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: currencyToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleSubmitCurrency = async (values) => {
    setCrudError(null);
    try {
      await restController.editCurrency(
        currencyToCRUD.id,
        values.title,
        values.description
      );
      handleModalClose();
      fetchCurrencies();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування валюти...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <CurrencyForm
            currency={currencyToCRUD}
            onSubmit={handleSubmitCurrency}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default CurrencyEditPage;
