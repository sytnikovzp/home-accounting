import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

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

  const message = `Ви впевнені, що хочете видалити заклад «${title}»? 
    Це призведе до видалення всіх витрат, пов'язаних з цим закладом.`;

  return (
    <DeleteConfirmModal
      error={error}
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
