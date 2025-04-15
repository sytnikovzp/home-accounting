import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    const response = await removeRole(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      actionsOnRight={
        <>
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
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити роль «${role?.title}»?`}
      isFetching={isFetching}
      title='Видалення ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleRemovePage;
