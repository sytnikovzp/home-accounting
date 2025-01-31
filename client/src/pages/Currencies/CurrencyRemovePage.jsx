import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function CurrencyRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: currency, isLoading: isFetching } = useFetchCurrencyByUuidQuery(
    uuid,
    { skip: !uuid }
  );

  const [removeCurrency, { isLoading: isRemoving, error: removeError }] =
    useRemoveCurrencyMutation();

  const handleDeleteCurrency = useCallback(async () => {
    if (!currency?.uuid) {
      return;
    }
    const result = await removeCurrency(currency.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [currency?.uuid, handleModalClose, removeCurrency]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isRemoving}
        size='large'
        variant='contained'
        onClick={handleDeleteCurrency}
      >
        Видалити
      </Button>,
    ],
    [isRemoving, handleDeleteCurrency]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити валюту «{currency?.title}»? Зверніть
        увагу, що видалення цієї валюти призведе до видалення всіх витрат, у
        яких вона використовується.
      </Typography>
    );
  }, [isFetching, currency?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={removeError?.data}
      title='Видалення валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyRemovePage;
