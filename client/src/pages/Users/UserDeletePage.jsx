import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function UserDeletePage({
  handleModalClose,
  fetchUsers,
  crudError,
  setCrudError,
  currentUser,
  setIsAuthenticated,
}) {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const {
    entity: userToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('User');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleLogout = async () => {
    try {
      await restController.logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Помилка виходу із системи:', error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await restController.removeUser(userToCRUD.uuid);
      if (userToCRUD.uuid === currentUser.uuid) {
        await handleLogout();
      } else {
        handleModalClose();
        fetchUsers();
      }
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      actions={[
        <Button
          key='delete'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteUser}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            {userToCRUD?.uuid === currentUser.uuid
              ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
              : `Ви впевнені, що хочете видалити користувача «${userToCRUD?.fullName}»?`}
          </Typography>
        )
      }
      error={errorMessage || crudError}
      title='Видалення користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserDeletePage;
