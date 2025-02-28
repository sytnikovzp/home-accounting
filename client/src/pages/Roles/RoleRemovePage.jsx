import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title } = role ?? {};

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveRole = useCallback(async () => {
    const result = await removeRole(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveRole}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveRole]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesRedlineTypography} variant='body1'>
        Ви впевнені, що хочете видалити роль «{title}»?
      </Typography>
    );
  }, [isFetching, title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleRemovePage;
