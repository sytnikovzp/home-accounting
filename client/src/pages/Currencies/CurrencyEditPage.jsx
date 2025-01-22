import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CurrencyForm from '../../components/Forms/CurrencyForm/CurrencyForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
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
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
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
      error={error || crudError}
      title='Редагування валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyEditPage;
