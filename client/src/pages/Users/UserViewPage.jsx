import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Link, Tooltip } from '@mui/material';
import {
  AlternateEmail,
  AssignmentInd,
  CalendarToday,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Info,
  Update,
} from '@mui/icons-material';

import { BASE_URL } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import {
  stylesUserViewPageEmailBox,
  stylesUserViewPageEmailBoxButton,
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

const getStatusIcon = (emailVerificationStatus) => {
  const icons = {
    Веріфікований: <CheckCircle color='success' />,
    'Очікує веріфікації': <HourglassEmpty color='warning' />,
  };
  return icons[emailVerificationStatus] || <Cancel color='error' />;
};

function UserViewPage({ handleModalClose }) {
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

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    userToCRUD || {};

  const { createdAt, updatedAt } = creation || {};

  const handleResendVerification = async (email) => {
    try {
      const response = await restController.resendVerifyEmail(email);
      navigate(
        `/notification?severity=${encodeURIComponent(
          response.severity
        )}&title=${encodeURIComponent(
          response.title
        )}&message=${encodeURIComponent(response.message)}`
      );
    } catch (error) {
      console.error(
        'Помилка надсилання повторного електронного листа для підтвердження:',
        error.message
      );
    }
  };

  const photoSrc = photo
    ? `${BASE_URL.replace('/api/', '')}/images/users/${photo}`
    : undefined;

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
          <Box sx={stylesViewPageBox}>
            <Box sx={stylesViewPageBoxWithAvatar}>
              <ViewDetailRow icon={Info} label='Повне ім’я' value={fullName} />
              <Avatar
                src={photoSrc}
                alt='Фото користувача'
                variant='rounded'
                sx={stylesViewPageAvatarSize}
              />
            </Box>
            <ViewDetailRow
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
            {email && (
              <ViewDetailRow
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
            )}
            {emailVerificationStatus && (
              <Box sx={stylesUserViewPageEmailBox}>
                <ViewDetailRow
                  icon={() => getStatusIcon(emailVerificationStatus)}
                  label='Обліковий запис'
                  value={emailVerificationStatus}
                />
                {emailVerificationStatus === 'Очікує веріфікації' && (
                  <Tooltip title='Повторно відправити email'>
                    <Button
                      variant='text'
                      size='small'
                      sx={stylesUserViewPageEmailBoxButton}
                      onClick={() => handleResendVerification(email)}
                    >
                      ⟳
                    </Button>
                  </Tooltip>
                )}
              </Box>
            )}
            {createdAt && (
              <ViewDetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
            )}
            {updatedAt && (
              <ViewDetailRow
                icon={Update}
                label='Редаговано'
                value={updatedAt}
              />
            )}
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default UserViewPage;
