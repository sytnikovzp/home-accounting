import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import {
  AlternateEmail,
  AssignmentInd,
  CalendarToday,
  Info,
  Update,
} from '@mui/icons-material';

import { configs } from '../../constants';
import {
  useFetchUserByUuidQuery,
  useResendVerifyEmailMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import {
  stylesUserViewPageEmailButton,
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

const { BASE_URL } = configs;

function UserViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: user,
    isLoading: isFetching,
    error,
  } = useFetchUserByUuidQuery(uuid, { skip: !uuid });

  const [resendVerifyEmail, { isLoading: emailVerificationLoading }] =
    useResendVerifyEmailMutation();

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    user ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const photoPath = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api/', '');
    return photo ? `${baseUrl}/images/users/${photo}` : null;
  }, [photo]);

  const handleResendClick = useCallback(() => {
    if (email) {
      resendVerifyEmail(email);
    }
  }, [email, resendVerifyEmail]);

  const data = useMemo(
    () => [
      {
        icon: Info,
        label: 'Повне ім’я',
        value: fullName,
        extra: (
          <Avatar
            alt='Фото користувача'
            src={photoPath}
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
                    disabled={emailVerificationLoading}
                    size='small'
                    sx={stylesUserViewPageEmailButton}
                    variant='text'
                    onClick={handleResendClick}
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
        label: 'Зареєстровано',
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
      photoPath,
      role,
      email,
      emailVerificationStatus,
      emailVerificationLoading,
      handleResendClick,
      createdAt,
      updatedAt,
    ]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} extraStyles={stylesViewPageBoxWithAvatar} />
      </Box>
    );
  }, [data, isFetching]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Деталі користувача...'
      onClose={handleModalClose}
    />
  );
}

export default UserViewPage;
