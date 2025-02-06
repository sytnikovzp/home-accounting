import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import { CalendarToday, Description, Info, Update } from '@mui/icons-material';

import useAuthUser from '../../hooks/useAuthUser';
import { useFetchRoleByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import PermissionsList from '../../components/ViewDetails/PermissionsList';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function RoleViewPage() {
  const { uuid: paramUuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const uuid = paramUuid || authenticatedUser?.role?.uuid;

  const {
    data: role,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title, description, permissions, createdAt, updatedAt } = role ?? {};

  const handleModalClose = useCallback(() => {
    if (paramUuid) {
      navigate('/roles');
    } else {
      navigate(-1);
    }
  }, [paramUuid, navigate]);

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      { icon: Description, label: 'Опис', value: description },
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [title, description, createdAt, updatedAt]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} />
        <Divider />
        <Typography variant='body1'>Дозволи (Permissions):</Typography>
        <PermissionsList permissions={permissions} />
      </Box>
    );
  }, [data, isFetching, permissions]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={fetchError?.data}
      title='Деталі ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleViewPage;
