import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import useAuthUser from '../../hooks/useAuthUser';
import {
  useFetchUserByUuidQuery,
  useLogoutMutation,
  useRemoveUserMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function UserRemovePage({ handleModalClose }) {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const { authenticatedUser } = useAuthUser();

  const { data: user, isLoading: isFetching } = useFetchUserByUuidQuery(uuid, {
    skip: !uuid,
  });

  const [removeUser, { isLoading: isRemoving, error: removeError }] =
    useRemoveUserMutation();

  const [logoutMutation] = useLogoutMutation();

  const handleRemoveUser = useCallback(async () => {
    if (!user?.uuid) {
      return;
    }
    const result = await removeUser(user.uuid);
    if (user.uuid === authenticatedUser?.uuid) {
      await logoutMutation();
      navigate('/');
      return;
    }
    if (result?.data) {
      handleModalClose();
    }
  }, [
    user,
    removeUser,
    authenticatedUser?.uuid,
    logoutMutation,
    navigate,
    handleModalClose,
  ]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isFetching || isRemoving}
        size='large'
        variant='contained'
        onClick={handleRemoveUser}
      >
        Видалити
      </Button>,
    ],
    [isFetching, isRemoving, handleRemoveUser]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }

    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        {user?.uuid === authenticatedUser?.uuid
          ? 'Це призведе до видалення Вашого облікового запису та виходу із системи. Ви впевнені, що хочете продовжити?'
          : `Ви впевнені, що хочете видалити користувача «${user?.fullName}»?`}
      </Typography>
    );
  }, [authenticatedUser?.uuid, isFetching, user?.fullName, user?.uuid]);

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
