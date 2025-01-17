import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import {
  AlternateEmail,
  AssignmentInd,
  CalendarToday,
  Info,
  Update,
} from '@mui/icons-material';

import { BASE_URL } from '../../constants';
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import {
  stylesUserViewPageEmailButton,
  stylesViewPageAvatarSize,
  stylesViewPageBox,
} from '../../styles';

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
    if (uuid && !userToCRUD) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid, userToCRUD]);

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    userToCRUD || {};
  const { createdAt, updatedAt } = creation || {};

  const handleResendVerification = useCallback(
    async (email) => {
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
        console.error('Error sending verification email:', error.message);
      }
    },
    [navigate]
  );

  const photoSrc = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api/', '');
    if (photo) {
      return `${baseUrl}/images/users/${photo}`;
    }
    return null;
  }, [photo]);

  const data = useMemo(
    () => [
      {
        icon: Info,
        label: 'Повне ім’я',
        value: fullName,
        extra: (
          <Avatar
            alt='Фото користувача'
            src={photoSrc}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
      },
      {
        icon: AssignmentInd,
        label: 'Роль',
        value: role?.title || '*Немає даних*',
        isLink: Boolean(role),
        linkTo: role ? `/roles/${role?.uuid}` : '',
      },
      ...(email
        ? [
            {
              icon: AlternateEmail,
              label: 'Email',
              value: email,
              isLink: true,
              linkTo: `mailto:${email}`,
            },
          ]
        : []),
      ...(emailVerificationStatus
        ? [
            {
              icon: () => <StatusIcon status={emailVerificationStatus} />,
              label: 'Обліковий запис',
              value: emailVerificationStatus,
              extra: emailVerificationStatus === 'Очікує веріфікації' && (
                <Tooltip title='Повторно відправити email'>
                  <Button
                    size='small'
                    sx={stylesUserViewPageEmailButton}
                    variant='text'
                    onClick={() => handleResendVerification(email)}
                  >
                    ⟳
                  </Button>
                </Tooltip>
              ),
            },
          ]
        : []),
      {
        icon: CalendarToday,
        label: 'Зареєстовано',
        value: createdAt,
      },
      {
        icon: Update,
        label: 'Редаговано',
        value: updatedAt,
      },
    ],
    [
      fullName,
      photoSrc,
      role,
      email,
      emailVerificationStatus,
      createdAt,
      updatedAt,
      handleResendVerification,
    ]
  );

  return (
    <ModalWindow
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetails data={data} />
          </Box>
        )
      }
      error={errorMessage}
      title='Деталі користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
