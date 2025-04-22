import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CurrencyRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currencyData,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const [removeCurrency, { isLoading: isRemoving, error: removeError }] =
    useRemoveCurrencyMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити валюту «${currencyData?.title}»?`;

  const handleRemove = useCallback(async () => {
    const response = await removeCurrency(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCurrency]);

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення валюти'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default CurrencyRemovePage;
