import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function CurrencyRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currency,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const { title } = currency ?? {};

  const [removeCurrency, { isLoading: isRemoving, error: removeError }] =
    useRemoveCurrencyMutation();

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveCurrency = useCallback(async () => {
    const result = await removeCurrency(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCurrency]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveCurrency}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveCurrency]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити валюту «{title}»? Зверніть увагу, що
        видалення цієї валюти призведе до видалення всіх витрат, у яких вона
        використовується.
      </Typography>
    );
  }, [isFetching, title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyRemovePage;
