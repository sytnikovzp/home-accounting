import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title } = role ?? {};

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const error = fetchError || removeError;

  const handleRemoveRole = useCallback(async () => {
    const result = await removeRole(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

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
        onClick={handleRemoveRole}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ConfirmMessage>
      Ви впевнені, що хочете видалити роль «{title}»?
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
      title='Видалення ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleRemovePage;
