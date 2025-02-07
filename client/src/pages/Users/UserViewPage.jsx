import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import {
  AlternateEmail,
  AssignmentInd,
  CalendarToday,
  Info,
  Update,
} from '@mui/icons-material';

import { configs } from '../../constants';
import useAuthUser from '../../hooks/useAuthUser';
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
} from '../../styles';

const { BASE_URL } = configs;

function UserViewPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const {
    data: user,
    isFetching,
    error: fetchError,
  } = useFetchUserByUuidQuery(uuid, { skip: isAuthenticatedUser });

  const userData = useMemo(
    () => (isAuthenticatedUser ? authenticatedUser : user),
    [isAuthenticatedUser, authenticatedUser, user]
  );

  const { fullName, role, photo, email, emailVerificationStatus, creation } =
    userData ?? {};
  const { createdAt, updatedAt } = creation ?? {};

  const [
    resendVerifyEmail,
    { isLoading: isEmailSubmitting, error: submitEmailError },
  ] = useResendVerifyEmailMutation();

  const error = fetchError || submitEmailError;

  const photoPath = useMemo(() => {
    const baseUrl = BASE_URL.replace('/api', '');
    return photo ? `${baseUrl}/images/users/${photo}` : null;
  }, [photo]);

  const handleModalClose = useCallback(() => {
    if (uuid) {
      navigate('/users');
    } else {
      navigate(-1);
    }
  }, [uuid, navigate]);

  const handleResendClick = useCallback(() => {
    if (email) {
      resendVerifyEmail(email);
    }
  }, [email, resendVerifyEmail]);

  const data = useMemo(
    () => [
      {
        extra: (
          <Avatar
            alt='Фото користувача'
            src={photoPath}
            sx={stylesViewPageAvatarSize}
            variant='rounded'
          />
        ),
        icon: Info,
        label: 'Повне ім’я',
        value: fullName,
      },
      {
        icon: AssignmentInd,
        isLink: Boolean(role),
        label: 'Роль',
        linkTo: role ? `/roles/${role?.uuid}` : '',
        value: role?.title || '*Немає даних*',
      },
      ...(email
        ? [
            {
              icon: AlternateEmail,
              isLink: true,
              label: 'Email',
              linkTo: `mailto:${email}`,
              value: email,
            },
          ]
        : []),
      ...(emailVerificationStatus
        ? [
            {
              extra: emailVerificationStatus === 'Очікує веріфікації' && (
                <Tooltip title='Повторно відправити email'>
                  <Button
                    disabled={isEmailSubmitting}
                    size='small'
                    sx={stylesUserViewPageEmailButton}
                    variant='text'
                    onClick={handleResendClick}
                  >
                    ⟳
                  </Button>
                </Tooltip>
              ),
              icon: () => <StatusIcon status={emailVerificationStatus} />,
              label: 'Обліковий запис',
              value: emailVerificationStatus,
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
      isEmailSubmitting,
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
        <ViewDetails data={data} />
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
