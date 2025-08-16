import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function EstablishmentRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishmentData,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const [removeEstablishment, { isLoading: isRemoving, error: removeError }] =
    useRemoveEstablishmentMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити заклад «${establishmentData?.title}»? Це
          призведе до видалення всіх витрат, пов'язаних з цим закладом.`;

  const handleRemove = useCallback(async () => {
    const response = await removeEstablishment(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeEstablishment]);

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
      title='Видалення закладу'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default EstablishmentRemovePage;
