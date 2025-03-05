import { useCallback } from 'react';

import { Alert, Box, Button } from '@mui/material';

import { useAddRoleMutation } from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function RoleAddPage({ handleModalClose }) {
  const [addRole, { isLoading: isSubmitting, error: submitError }] =
    useAddRoleMutation();

  const error = submitError?.data;

  const handleSubmitRole = useCallback(
    async (values) => {
      const result = await addRole(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addRole, handleModalClose]
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
    <ModalWindow isOpen title='Додавання ролі' onClose={handleModalClose}>
      <RoleForm isSubmitting={isSubmitting} onSubmit={handleSubmitRole} />
    </ModalWindow>
  );
}

export default RoleAddPage;
