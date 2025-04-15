import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useEditRoleMutation,
  useFetchRoleByUuidQuery,
} from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function RoleEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const [editRole, { isLoading: isSubmitting, error: submitError }] =
    useEditRoleMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitRole = useCallback(
    async (values) => {
      const response = await editRole({ roleUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editRole, handleModalClose, uuid]
  );

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
      isFetching={isFetching}
      title='Редагування ролі'
      onClose={handleModalClose}
    >
      <RoleForm
        isSubmitting={isSubmitting}
        role={role}
        onSubmit={handleSubmitRole}
      />
    </ModalWindow>
  );
}

export default RoleEditPage;
