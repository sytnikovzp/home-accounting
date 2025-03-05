import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import useAuthUser from '../../hooks/useAuthUser';

import { useFetchRoleByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import PermissionsList from '../../components/ViewDetails/PermissionsList';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

function RoleViewPage() {
  const { uuid: paramUuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const uuid = paramUuid || authenticatedUser?.role?.uuid;

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title, description, permissions, creation } = role ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const error = fetchError?.data;

  const data = useMemo(
    () => [
      { icon: InfoIcon, label: 'Назва', value: title },
      { icon: DescriptionIcon, label: 'Опис', value: description },
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
    ],
    [title, description, createdAt, updatedAt]
  );

  const handleModalClose = useCallback(() => {
    if (paramUuid) {
      navigate('/roles');
    } else {
      navigate(-1);
    }
  }, [paramUuid, navigate]);

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
    <ModalWindow isOpen title='Деталі ролі' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <>
          <ViewDetails data={data} />
          <PermissionsList permissions={permissions} />
        </>
      )}
    </ModalWindow>
  );
}

export default RoleViewPage;
