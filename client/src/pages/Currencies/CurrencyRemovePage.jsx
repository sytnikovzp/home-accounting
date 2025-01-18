import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function CurrencyRemovePage({
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
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteCurrency = async () => {
    try {
      await restController.removeCurrency(currencyToCRUD.uuid);
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
      actions={[
        <Button
          key='remove'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteCurrency}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити валюту «{currencyToCRUD?.title}»?
            Зверніть увагу, що видалення цієї валюти призведе до видалення всіх
            витрат, у яких вона використовується.
          </Typography>
        )
      }
      error={errorMessage || crudError}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyRemovePage;
