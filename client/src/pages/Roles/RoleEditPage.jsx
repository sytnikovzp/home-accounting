import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button } from '@mui/material';

import {
  useEditRoleMutation,
  useFetchRoleByUuidQuery,
} from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
      const result = await editRole({ roleUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editRole, handleModalClose, uuid]
  );

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
    <ModalWindow isOpen title='Редагування ролі' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <RoleForm
          isSubmitting={isSubmitting}
          role={role}
          onSubmit={handleSubmitRole}
        />
      )}
    </ModalWindow>
  );
}

export default RoleEditPage;
