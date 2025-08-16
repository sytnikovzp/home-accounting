import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import useAuthentication from '@/src/hooks/useAuthentication';

import { useFetchRoleByUuidQuery } from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow';
import ViewDetails from '@/src/components/ViewDetails';
import PermissionsList from '@/src/components/ViewDetails/PermissionsList';

function RoleViewPage() {
  const { uuid: paramUuid } = useParams();
  const { authenticatedUser } = useAuthentication();
  const navigate = useNavigate();

  const uuid = paramUuid || authenticatedUser?.role?.uuid;

  const {
    data: roleData,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title, description, permissions, creation } = roleData ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const apiError = fetchError?.data;

  const renderDetailsData = useMemo(
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

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Деталі ролі'
      onClose={handleModalClose}
    >
      <>
        <ViewDetails data={renderDetailsData} />
        <PermissionsList permissions={permissions} />
      </>
    </ModalWindow>
  );
}

export default RoleViewPage;
