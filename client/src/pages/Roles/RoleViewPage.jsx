import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';

import useAuthUser from '../../hooks/useAuthUser';

import { useFetchRoleByUuidQuery } from '../../store/services';

import EntityViewModal from '../../components/ModalWindow/EntityViewModal';

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

  const handleModalClose = useCallback(() => {
    if (paramUuid) {
      navigate('/roles');
    } else {
      navigate(-1);
    }
  }, [paramUuid, navigate]);

  const data = useMemo(
    () => [
      { icon: InfoIcon, label: 'Назва', value: title },
      { icon: DescriptionIcon, label: 'Опис', value: description },
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
    ],
    [title, description, createdAt, updatedAt]
  );

  return (
    <EntityViewModal
      data={data}
      error={fetchError}
      isFetching={isFetching}
      permissions={permissions}
      title='Деталі ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleViewPage;
