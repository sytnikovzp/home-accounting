import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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

  const actions = (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
      <Button color='default' variant='text' onClick={handleModalClose}>
        Скасувати
      </Button>
      <Button
        color='error'
        disabled={isRemoving || isFetching}
        type='submit'
        variant='contained'
        onClick={handleRemoveEstablishment}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ConfirmMessage>
      Ви впевнені, що хочете видалити заклад «{title}»? Це призведе до видалення
      всіх витрат, пов`язаних з цим закладом.
    </ConfirmMessage>
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      title='Видалення закладу'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentRemovePage;
