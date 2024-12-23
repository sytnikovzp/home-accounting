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
  const { uuid } = useParams();
  const {
    entity: currencyToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitCurrency = async (values) => {
    setCrudError(null);
    try {
      await restController.editCurrency(
        currencyToCRUD.uuid,
        values.title,
        values.code
      );
      handleModalClose();
      fetchCurrencies();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
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
