import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link, Avatar } from '@mui/material';
import {
  Info,
  CalendarToday,
  Update,
  CheckCircle,
  Cancel,
  AlternateEmail,
  AssignmentInd,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
import { BASE_URL } from '../../constants';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

function UserViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: userToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('User');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    uuid: userUuid,
    fullName,
    role,
    photo,
    email,
    isActivated,
    creation,
  } = userToCRUD || {};

  const { createdAt, updatedAt } = creation || {};

  const statusIcon = isActivated ? (
    <CheckCircle color='success' />
  ) : (
    <Cancel color='error' />
  );

  const photoSrc = photo
    ? `${BASE_URL.replace('/api/', '')}/images/users/${photo}`
    : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі користувача...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <DetailRow icon={Info} label='UUID' value={userUuid} />
                <Avatar
                  src={photoSrc}
                  alt='Фото користувача'
                  variant='rounded'
                  sx={{ width: 50, height: 50 }}
                />
              </Box>
              <DetailRow icon={Info} label='Повне ім’я' value={fullName} />
              <DetailRow
                icon={AssignmentInd}
                label='Роль'
                value={
                  <Link
                    component={RouterLink}
                    to={`/roles/${role?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {role?.title}
                  </Link>
                }
              />
              <DetailRow
                icon={AlternateEmail}
                label='Email'
                value={
                  <Link
                    component={RouterLink}
                    to={`mailto:${email}`}
                    color='primary'
                    underline='hover'
                  >
                    {email}
                  </Link>
                }
              />
              <DetailRow
                icon={() => statusIcon}
                label='Обліковий запис'
                value={isActivated ? 'Підтверджено' : 'Не підтверджено'}
              />
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default UserViewPage;
