import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function RoleRemovePage({
  handleModalClose,
  fetchRoles,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: roleToCRUD,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Role');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteRole = async () => {
    try {
      await restController.removeRole(roleToCRUD.uuid);
      handleModalClose();
      fetchRoles();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
      actions={[
        <Button
          key='remove'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteRole}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити роль «{roleToCRUD?.title}»?
          </Typography>
        )
      }
      error={error || crudError}
      title='Видалення ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleRemovePage;
