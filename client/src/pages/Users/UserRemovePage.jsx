import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchUserByUuidQuery,
  useRemoveUserMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function UserRemovePage({
  handleModalClose,
  // currentUser
}) {
  const { uuid } = useParams();

  const { data: user, isLoading: isFetching } = useFetchUserByUuidQuery(uuid, {
    skip: !uuid,
  });

  const [removeUser, { isLoading: isRemoving, error: removeError }] =
    useRemoveUserMutation();

  // const handleLogout = async () => {
  //   await restController.logout();
  //   navigate('/');
  // };

  const handleDeleteUser = useCallback(async () => {
    if (!user?.uuid) {
      return;
    }

    // if (user.uuid === currentUser.uuid) {
    //   await handleLogout();
    // } else {
    //   handleModalClose();

    const result = await removeUser(user.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [user?.uuid, handleModalClose, removeUser]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isRemoving}
        size='large'
        variant='contained'
        onClick={handleDeleteUser}
      >
        Видалити
      </Button>,
    ],
    [isRemoving, handleDeleteUser]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        {/* {user?.uuid === currentUser.uuid */}
        {/* ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?' */}
        Ви впевнені, що хочете видалити користувача «{user?.fullName}»?
      </Typography>
    );
  }, [isFetching, user?.fullName]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={removeError?.data}
      title='Видалення користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserRemovePage;
