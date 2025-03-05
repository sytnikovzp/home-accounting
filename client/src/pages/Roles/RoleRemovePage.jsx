import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button } from '@mui/material';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveRole = useCallback(async () => {
    const result = await removeRole(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Видалення ролі' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          Ви впевнені, що хочете видалити роль «{role?.title}»?
        </ConfirmMessage>
      )}
      <ModalActions>
        <Button color='default' variant='text' onClick={handleModalClose}>
          Скасувати
        </Button>
        <Button
          color='error'
          disabled={isRemoving || isFetching}
          variant='contained'
          onClick={handleRemoveRole}
        >
          Видалити
        </Button>
      </ModalActions>
    </ModalWindow>
  );
}

export default RoleRemovePage;
