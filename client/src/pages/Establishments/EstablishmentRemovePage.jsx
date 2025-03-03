import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';

function EstablishmentRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishment,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const { title } = establishment ?? {};

  const [removeEstablishment, { isLoading: isRemoving, error: removeError }] =
    useRemoveEstablishmentMutation();

  const error = fetchError || removeError;

  const handleRemoveEstablishment = useCallback(async () => {
    const result = await removeEstablishment(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeEstablishment]);

  if (error) {
    return (
      <InfoModal
        isOpen
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  const message = `Ви впевнені, що хочете видалити заклад «${title}»? 
    Це призведе до видалення всіх витрат, пов'язаних з цим закладом.`;

  return (
    <DeleteConfirmModal
      isOpen
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення закладу'
      onClose={handleModalClose}
      onSubmit={handleRemoveEstablishment}
    />
  );
}

export default EstablishmentRemovePage;
