import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchCurrencyByUuidQuery,
  useRemoveCurrencyMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

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

  const error = fetchError || removeError;

  const handleRemoveCurrency = useCallback(async () => {
    const result = await removeCurrency(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCurrency]);

  const message = `Ви впевнені, що хочете видалити валюту «${title}»?`;

  return (
    <DeleteConfirmModal
      error={error}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення валюти'
      onClose={handleModalClose}
      onSubmit={handleRemoveCurrency}
    />
  );
}

export default CurrencyRemovePage;
