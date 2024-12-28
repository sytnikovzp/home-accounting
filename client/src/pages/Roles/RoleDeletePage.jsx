import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function RoleDeletePage({
  handleModalClose,
  fetchRoles,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: roleToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Role');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Видалення ролі...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography
            variant='body1'
            sx={{
              textAlign: 'justify',
              mt: 2,
              mb: 2,
              textIndent: '2em',
            }}
          >
            Ви впевнені, що хочете видалити роль «{roleToCRUD?.title}»?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteRole}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default RoleDeletePage;
